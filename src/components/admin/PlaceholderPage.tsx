import { Plus, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionCard, EmptyState, type Crumb } from "./primitives";

export function PlaceholderPage({
  title,
  description,
  icon,
  breadcrumbs,
  emptyTitle,
  emptyDescription,
  ctaLabel,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  breadcrumbs: Crumb[];
  emptyTitle: string;
  emptyDescription: string;
  ctaLabel: string;
}) {
  return (
    <>
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        actions={
          <Button className="gap-2 bg-gradient-to-l from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] text-white hover:opacity-95">
            <Plus className="h-4 w-4" />
            {ctaLabel}
          </Button>
        }
      />
      <SectionCard>
        <EmptyState
          icon={icon}
          title={emptyTitle}
          description={emptyDescription}
          action={
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              {ctaLabel}
            </Button>
          }
        />
      </SectionCard>
    </>
  );
}
