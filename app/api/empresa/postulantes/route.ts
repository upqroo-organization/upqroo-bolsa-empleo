import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Types for our data
interface ApplicantData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  cvUrl: string | null;
  position: string;
  appliedDate: Date;
  status: string;
  vacanteId: string;
  cvViewed: boolean;
  hiredAt: Date | null;
  career: string | null;
  notes?: string | null;
}

async function getApplicantsData(companyId: string): Promise<ApplicantData[]> {
  try {
    const applications = await prisma.application.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            cvUrl: true,
          }
        },
        vacante: {
          select: {
            id: true,
            title: true,
            companyId: true,
            career: true,
          }
        }
      },
      where: {
        vacante: {
          companyId: companyId
        }
      },
      orderBy: {
        appliedAt: 'desc'
      }
    });

    return applications.map(app => ({
      id: app.id,
      name: app.user.name,
      email: app.user.email,
      image: app.user.image,
      cvUrl: app.user.cvUrl,
      position: app.vacante.title,
      career: app.vacante.career,
      appliedDate: app.appliedAt,
      status: app.status,
      vacanteId: app.vacanteId,
      cvViewed: app.cvViewed,
      hiredAt: app.hiredAt,
      notes: null // We don't have notes in the schema, but we'll keep it in the interface for future use
    }));
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return [];
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get company data from session or database
  const company = await prisma.company.findUnique({
    where: { email: session.user.email }
  });

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const applicants = await getApplicantsData(company.id);
  
  return NextResponse.json({ applicants });
}