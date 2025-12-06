import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching todos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, dueDate } = await request.json();
    if (!title || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    // Parse date string and create Date at local midnight to avoid timezone issues
    let parsedDueDate = null;
    if (dueDate) {
      // Date string format: "YYYY-MM-DD"
      // Create date at local midnight to preserve the selected day
      const [year, month, day] = dueDate.split('-').map(Number);
      parsedDueDate = new Date(year, month - 1, day);
    }
    
    const todo = await prisma.todo.create({
      data: {
        title,
        dueDate: parsedDueDate,
      },
    });
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating todo' }, { status: 500 });
  }
}