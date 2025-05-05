import { showSubmittedData } from '@/utils/show-submitted-data'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useProjects } from '../context/projects-contex'
import { ProjectsMutateDrawer } from './projects-mutate-drawer'

export function ProjectsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProjects()
  return (
    <>
      <ProjectsMutateDrawer
        key='project-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <ProjectsMutateDrawer
            key={`project-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='project-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              showSubmittedData(
                currentRow,
                'The following project has been deleted:'
              )
            }}
            className='max-w-md'
            title={`Delete this project: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a project with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
