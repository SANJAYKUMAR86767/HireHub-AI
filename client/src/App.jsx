import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobDetail from "./pages/JobDetail";
import Chat from "./pages/Chat";
import CandidateDashboard from "./pages/candidate/Dashboard";
import MyApplications from "./pages/candidate/MyApplications";
import InterviewPrep from "./pages/candidate/InterviewPrep";
import ResumeBuilder from "./pages/candidate/ResumeBuilder";
import EnglishSpokenCoach from "./pages/candidate/EnglishSpokenCoach";
import AiCodingSandbox from "./pages/candidate/CodingSandbox";
import AiSkillCertification from "./pages/candidate/SkillCertification";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import PostJob from "./pages/recruiter/PostJob";
import Applicants from "./pages/recruiter/Applicants";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminJobs from "./pages/admin/Jobs";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/chat/:userId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

        <Route path="/candidate/dashboard" element={
          <ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>
        } />
        <Route path="/candidate/applications" element={
          <ProtectedRoute role="candidate"><MyApplications /></ProtectedRoute>
        } />
        <Route path="/candidate/interview-prep" element={
          <ProtectedRoute role="candidate"><InterviewPrep /></ProtectedRoute>
        } />
        <Route path="/candidate/resume-builder" element={
          <ProtectedRoute role="candidate"><ResumeBuilder /></ProtectedRoute>
        } />
        <Route path="/candidate/english-coach" element={
          <ProtectedRoute role="candidate"><EnglishSpokenCoach /></ProtectedRoute>
        } />
        <Route path="/candidate/coding-sandbox" element={
          <ProtectedRoute role="candidate"><AiCodingSandbox /></ProtectedRoute>
        } />
        <Route path="/candidate/certification" element={
          <ProtectedRoute role="candidate"><AiSkillCertification /></ProtectedRoute>
        } />

        <Route path="/recruiter/dashboard" element={
          <ProtectedRoute role="recruiter"><RecruiterDashboard /></ProtectedRoute>
        } />
        <Route path="/recruiter/post-job" element={
          <ProtectedRoute role="recruiter"><PostJob /></ProtectedRoute>
        } />
        <Route path="/recruiter/jobs/:jobId/applicants" element={
          <ProtectedRoute role="recruiter"><Applicants /></ProtectedRoute>
        } />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>
        } />
        <Route path="/admin/jobs" element={
          <ProtectedRoute role="admin"><AdminJobs /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}
