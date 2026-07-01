import { redirect } from "next/navigation";

export default async function BrandSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/press-kit/${slug}`);
}
