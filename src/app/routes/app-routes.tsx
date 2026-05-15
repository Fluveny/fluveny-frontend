import LandingPage from '@/components/landing-page';
import { AdminCreatorsPage } from '@/features/authentication/pages/admin-creators-page';
import { AdminReportsPage } from '@/features/authentication/pages/admin-reports-page';
import { ForceResetPasswordPage } from '@/features/authentication/pages/force-reset-password-page';
import { LoginPage } from '@/features/authentication/pages/login';
import { OnboardingPage } from '@/features/authentication/pages/onboarding-page';
import { ProfilePage } from '@/features/authentication/pages/profile-page';
import { RegisterPage } from '@/features/authentication/pages/register';
import { SettingsPage } from '@/features/authentication/pages/settings-page';
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page';
import { DraftsPage } from '@/features/module/pages/drafts-page';
import { FormIntroductionPage } from '@/features/module/pages/form-introduction-page';
import { FormModulePage } from '@/features/module/pages/form-module-page';
import { FormPresentationPage } from '@/features/module/pages/form-presentation-page';
import { ModuleVisualizationPage } from '@/features/module/pages/module-visualization-page';
import { PanelPage } from '@/features/module/pages/panel-page';
import { CreateModuleLayout } from '@/features/module/templates/create-module-layout';
import { ExerciseFinalChallengeOrchestrator } from '@/features/module/templates/exercise-final-challenge-orchestrator';
import { ExerciseGrammarRuleOrchestrator } from '@/features/module/templates/exercise-grammar-rule-orchestrator';
import { FinalChallengeLayout } from '@/features/module/templates/final-challenge-layout';
import { GrammarRuleLayout } from '@/features/module/templates/grammar-rule-layout';
import { Layout } from '@/templates/layout';
import { NotFound } from '@/templates/not-found';
import { ProtectedRoute } from '@/templates/private-route';
import { PublicRoute } from '@/templates/public-route';
import { createBrowserRouter } from 'react-router';
import { ROUTES } from '../configs/routes';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: ROUTES.dashboard,
        element: (
          <ProtectedRoute
            permittedRoles={['STUDENT', 'CONTENT_CREATOR', 'ADMIN']}
            redirect="/login"
          >
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.profile,
        element: (
          <ProtectedRoute
            permittedRoles={['STUDENT', 'CONTENT_CREATOR', 'ADMIN']}
            redirect="/login"
          >
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.settings,
        element: (
          <ProtectedRoute
            permittedRoles={['STUDENT', 'CONTENT_CREATOR', 'ADMIN']}
            redirect="/login"
          >
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.onboarding,
        element: (
          <ProtectedRoute
            permittedRoles={['STUDENT', 'CONTENT_CREATOR', 'ADMIN']}
            redirect="/login"
          >
            <OnboardingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.forceResetPassword,
        element: (
          <ProtectedRoute
            permittedRoles={['STUDENT', 'CONTENT_CREATOR', 'ADMIN']}
            redirect="/login"
          >
            <ForceResetPasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.adminCreators,
        element: (
          <ProtectedRoute permittedRoles={['ADMIN']} redirect="/dashboard">
            <AdminCreatorsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.adminReports,
        element: (
          <ProtectedRoute permittedRoles={['ADMIN']} redirect="/dashboard">
            <AdminReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.modules,
        children: [
          {
            element: (
              <ProtectedRoute
                permittedRoles={['STUDENT', 'CONTENT_CREATOR', 'ADMIN']}
                redirect="/login"
              />
            ),
            children: [
              { index: true, element: <PanelPage /> },
              { path: ROUTES.moduleId, element: <ModuleVisualizationPage /> },
            ],
          },
          {
            element: (
              <ProtectedRoute
                permittedRoles={['CONTENT_CREATOR']}
                redirect="/dashboard"
              />
            ),
            children: [
              { path: ROUTES.drafts, element: <DraftsPage /> },
              { path: ROUTES.create, element: <FormModulePage /> },
              {
                path: `${ROUTES.create}/${ROUTES.moduleId}`,
                element: <FormModulePage />,
              },
              {
                path: `${ROUTES.create}/${ROUTES.moduleId}`,
                element: <CreateModuleLayout />,
                children: [
                  {
                    path: ROUTES.introduction,
                    element: <FormIntroductionPage />,
                  },
                  {
                    path: `${ROUTES.grammarRule}/${ROUTES.grammarRuleId}`,
                    element: <GrammarRuleLayout />,
                    children: [
                      {
                        path: `${ROUTES.presentation}`,
                        element: <FormPresentationPage />,
                      },
                      {
                        path: `${ROUTES.presentation}/${ROUTES.windowId}`,
                        element: <FormPresentationPage />,
                      },
                      {
                        path: `${ROUTES.exercise}/${ROUTES.style}`,
                        element: <ExerciseGrammarRuleOrchestrator />,
                      },
                      {
                        path: `${ROUTES.exercise}/${ROUTES.style}/${ROUTES.windowId}/`,
                        element: <ExerciseGrammarRuleOrchestrator />,
                      },
                    ],
                  },
                  {
                    path: ROUTES.finalChallenge,
                    element: <FinalChallengeLayout />,
                    children: [
                      {
                        path: `${ROUTES.style}`,
                        element: <ExerciseFinalChallengeOrchestrator />,
                      },
                      {
                        path: `${ROUTES.style}/${ROUTES.exerciseId}`,
                        element: <ExerciseFinalChallengeOrchestrator />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      {
        path: 'login',
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
    ],
  },
]);
