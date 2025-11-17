import { useRoutes } from 'react-router-dom'
import { PipelinePage } from './features/pipeline/pages/PipelinePage'
import { JobGeneratorPage } from './features/job-generator/pages/JobGeneratorPage'
import { ExecutiveSummaryPage } from './features/executive-summary/pages/ExecutiveSummaryPage'
import { InsightsPage } from './features/insights/pages/InsightsPage'
import { CandidateReportPage } from './features/candidate-report/pages/CandidateReportPage'
import { CandidatesPage } from './features/candidates/pages/CandidatesPage'

export function AppRouter() {
  const routes = useRoutes([
    { path: '/', element: <PipelinePage /> },
    { path: '/jobs/new', element: <JobGeneratorPage /> },
    { path: '/executive-summary', element: <ExecutiveSummaryPage /> },
    { path: '/insights', element: <InsightsPage /> },
    { path: '/candidates', element: <CandidatesPage /> },
    { path: '/candidates/:id/report', element: <CandidateReportPage /> },
  ])

  return routes
}

