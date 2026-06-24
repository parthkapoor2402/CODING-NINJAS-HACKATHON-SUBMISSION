import { lazy } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import { CitizenShell } from '@/layouts/CitizenShell';

import { AdminShell } from '@/layouts/AdminShell';

import {

  RequireAuth,

  RequireCitizenApp,

  RequireOnboardingIncomplete,

  RoleRedirect,

} from '@/layouts/RequireAuth';

import { ROUTES } from '@/lib/constants';



const SplashPage = lazy(() => import('@/features/onboarding/SplashPage'));

const HomePage = lazy(() => import('@/features/home/HomePage'));

const ReportingPage = lazy(() => import('@/features/reporting/ReportingPage'));

const TrackingPage = lazy(() => import('@/features/tracking/TrackingPage'));

const VerificationPage = lazy(() => import('@/features/verification/VerificationPage'));

const IssueDetailPage = lazy(() => import('@/features/feed/IssueDetailPage'));

const NearbyIssuesPage = lazy(() => import('@/features/feed/NearbyIssuesPage'));

const RewardsPage = lazy(() => import('@/features/rewards/RewardsPage'));

const ProfilePage = lazy(() => import('@/features/profile/ProfilePage'));

const YouthModePage = lazy(() => import('@/features/youth-mode/YouthModePage'));

const OnboardingPage = lazy(() => import('@/features/onboarding/OnboardingPage'));

const AuthPage = lazy(() => import('@/features/onboarding/AuthPage'));



const AdminDashboardPage = lazy(() => import('@/features/admin-dashboard/AdminDashboardPage'));

const AdminQueuePage = lazy(() => import('@/features/admin-queue/AdminQueuePage'));

const AdminIssueDetailPage = lazy(() => import('@/features/admin-issue/AdminIssueDetailPage'));

const AdminHotspotPage = lazy(() => import('@/features/admin-hotspots/AdminHotspotPage'));

const AdminAnalyticsPage = lazy(() => import('@/features/admin-analytics/AdminAnalyticsPage'));

const AdminModerationPage = lazy(() => import('@/features/admin-moderation/AdminModerationPage'));



export function AppRoutes() {

  return (

    <Routes>

      <Route path={ROUTES.splash} element={<SplashPage />} />

      <Route path="/" element={<RequireAuth><RoleRedirect /></RequireAuth>} />

      <Route path="/auth" element={<AuthPage />} />

      <Route

        path="/onboarding"

        element={

          <RequireOnboardingIncomplete>

            <OnboardingPage />

          </RequireOnboardingIncomplete>

        }

      />



      <Route

        path="/app"

        element={

          <RequireCitizenApp>

            <CitizenShell />

          </RequireCitizenApp>

        }

      >

        <Route index element={<Navigate to={ROUTES.home} replace />} />

        <Route path="home" element={<HomePage />} />

        <Route path="report" element={<ReportingPage />} />

        <Route path="track" element={<TrackingPage />} />

        <Route path="community" element={<VerificationPage />} />

        <Route path="nearby" element={<NearbyIssuesPage />} />

        <Route path="issue/:id" element={<IssueDetailPage />} />

        <Route path="rewards" element={<RewardsPage />} />

        <Route path="profile" element={<ProfilePage />} />

        <Route path="family" element={<YouthModePage />} />

      </Route>



      <Route

        path="/admin"

        element={

          <RequireAuth>

            <AdminShell />

          </RequireAuth>

        }

      >

        <Route index element={<Navigate to={ROUTES.admin.dashboard} replace />} />

        <Route path="dashboard" element={<AdminDashboardPage />} />

        <Route path="queue" element={<AdminQueuePage />} />

        <Route path="queue/:id" element={<AdminIssueDetailPage />} />

        <Route path="hotspots" element={<AdminHotspotPage />} />

        <Route path="analytics" element={<AdminAnalyticsPage />} />

        <Route path="moderation" element={<AdminModerationPage />} />

      </Route>



      <Route path="*" element={<Navigate to={ROUTES.splash} replace />} />

    </Routes>

  );

}


