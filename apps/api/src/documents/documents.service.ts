import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CandidateDocumentDto, CreateDocumentDto } from '@ai-interview-coach/types';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async createDocument(
    userId: string,
    dto: CreateDocumentDto,
  ): Promise<CandidateDocumentDto> {
    const document = await this.prisma.candidateDocument.create({
      data: {
        userId,
        title: dto.title,
        type: dto.type,
        content: dto.content,
      },
    });

    // Seed document chunks for vector RAG searching
    const chunks = this.chunkText(dto.content);
    await this.prisma.documentChunk.createMany({
      data: chunks.map((c, idx) => ({
        documentId: document.id,
        orderIndex: idx + 1,
        content: c,
      })),
    });

    return this.mapToDto(document);
  }

  async getDocuments(userId: string): Promise<CandidateDocumentDto[]> {
    const docs = await this.prisma.candidateDocument.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return docs.map((d) => this.mapToDto(d));
  }

  async deleteDocument(
    userId: string,
    documentId: string,
  ): Promise<{ message: string }> {
    const doc = await this.prisma.candidateDocument.findFirst({
      where: { id: documentId, userId },
    });

    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    await this.prisma.candidateDocument.delete({
      where: { id: documentId },
    });

    return { message: 'Document removed successfully' };
  }

  private chunkText(text: string, chunkSize = 300): string[] {
    const paragraphs = text.split('\n\n');
    return paragraphs.filter((p) => p.trim().length > 0);
  }

  private mapToDto(doc: any): CandidateDocumentDto {
    return {
      id: doc.id,
      userId: doc.userId,
      title: doc.title,
      type: doc.type,
      content: doc.content,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }
}
