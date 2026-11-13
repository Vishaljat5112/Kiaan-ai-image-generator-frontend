import React from 'react'
import { FolderKanban } from 'lucide-react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function ProjectsPage() {
  return (
    <RoutePlaceholder
      title="Projects & Workspaces"
      description="Organize your visual marketing campaigns, assets, and folders."
      category="Asset Management"
      emptyTitle="No projects created yet."
      emptyDescription="Create a project folder to organize your visual marketing campaigns and creative assets."
      emptyIcon={FolderKanban}
      features={[
        'Nested folder hierarchies for client projects and creative campaigns',
        'Bulk drag-and-drop asset assignment to folders',
        'Project-level credit usage tracking and asset tagging',
        'Shareable project showcase links with read-only client access'
      ]}
    />
  )
}

export default ProjectsPage
