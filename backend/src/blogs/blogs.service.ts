import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string) {
    const where: any = { published: true };
    if (category) {
      where.category = category;
    }
    return this.prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOneBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true }
        }
      }
    });
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    return post;
  }

  async create(authorId: string, data: any) {
    let slug = slugify(data.title);
    
    // Check if slug is unique, append timestamp if duplicate
    const existing = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    return this.prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        summary: data.summary,
        category: data.category,
        imageCover: data.imageCover || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
        published: data.published !== undefined ? data.published : true,
        authorId,
      },
      include: {
        author: {
          select: { id: true, name: true }
        }
      }
    });
  }

  async update(id: string, data: any) {
    const updateData: any = {};
    if (data.title !== undefined) {
      updateData.title = data.title;
      updateData.slug = slugify(data.title);
    }
    if (data.content !== undefined) updateData.content = data.content;
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.imageCover !== undefined) updateData.imageCover = data.imageCover;
    if (data.published !== undefined) updateData.published = data.published;

    try {
      return await this.prisma.blogPost.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: { id: true, name: true }
          }
        }
      });
    } catch (e) {
      throw new NotFoundException('Blog post not found');
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.blogPost.delete({ where: { id } });
      return { success: true };
    } catch (e) {
      throw new NotFoundException('Blog post not found');
    }
  }
}
