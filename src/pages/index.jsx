import Layout from "./Layout.jsx";
import Login from "./Login.jsx";

import Dashboard from "./Dashboard";
import Contracts from "./Contracts";
import TokenAnalytics from "./TokenAnalytics";
import Markets from "./Markets";
import Oracles from "./Oracles";
import AuditLogs from "./AuditLogs";
import Alerts from "./Alerts";
import Compliance from "./Compliance";
import SecurityPosture from "./SecurityPosture";
import Policies from "./Policies";
import RiskManagement from "./RiskManagement";
import DataGovernance from "./DataGovernance";
import AIGovernance from "./AIGovernance";
import NeuralIntelligence from "./NeuralIntelligence";
import AutomationEngine from "./AutomationEngine";
import ExplainabilityCenter from "./ExplainabilityCenter";
import DeviationMonitor from "./DeviationMonitor";
import AIActionsLog from "./AIActionsLog";
import AccessControl from "./AccessControl";
import TrustLayer from "./TrustLayer";
import TrustBoundaries from "./TrustBoundaries";
import TemporalReasoning from "./TemporalReasoning";
import TreasuryOps from "./TreasuryOps";
import ScenarioSimulator from "./ScenarioSimulator";
import FeedbackLoop from "./FeedbackLoop";
import Certify from "./Certify";
import PredictionRiskMap from "./PredictionRiskMap";
import Schedulers from "./Schedulers";
import SystemStatus from "./SystemStatus";
import DataVault from "./DataVault";
import IdentityGraph from "./IdentityGraph";
import Exports from "./Exports";
import AgentControls from "./AgentControls";
import Forensics from "./Forensics";
import TrainingDataLab from "./TrainingDataLab";
import MetricsDesign from "./MetricsDesign";
import EmergencyActions from "./EmergencyActions";
import DecisionHistory from "./DecisionHistory";
import QuorumGovernance from "./QuorumGovernance";
import ComponentStore from "./ComponentStore";
import NeuralPolicyComposer from "./NeuralPolicyComposer";
import TrustTruthEngine from "./TrustTruthEngine";
import ConstitutionalGuard from "./ConstitutionalGuard";
import UserSettings from "./UserSettings";
import Notifications from "./Notifications";
import ArchitectureExport_DatabaseSchema from "./ArchitectureExport_DatabaseSchema";
import ArchitectureExport_APIEndpoints from "./ArchitectureExport_APIEndpoints";
import ArchitectureExport_MigrationGuide from "./ArchitectureExport_MigrationGuide";
import ArchitectureExport_ComponentStructure from "./ArchitectureExport_ComponentStructure";
import ArchitectureExport_BackendStructure from "./ArchitectureExport_BackendStructure";
import ArchitectureExport_SystemAlignment from "./ArchitectureExport_SystemAlignment";
import ProductionMigrationGuide from "./ProductionMigrationGuide";

import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { auth } from '@/api/auth';

const PAGES = {
    Dashboard: Dashboard,
    Contracts: Contracts,
    TokenAnalytics: TokenAnalytics,
    Markets: Markets,
    Oracles: Oracles,
    AuditLogs: AuditLogs,
    Alerts: Alerts,
    Compliance: Compliance,
    SecurityPosture: SecurityPosture,
    Policies: Policies,
    RiskManagement: RiskManagement,
    DataGovernance: DataGovernance,
    AIGovernance: AIGovernance,
    NeuralIntelligence: NeuralIntelligence,
    AutomationEngine: AutomationEngine,
    ExplainabilityCenter: ExplainabilityCenter,
    DeviationMonitor: DeviationMonitor,
    AIActionsLog: AIActionsLog,
    AccessControl: AccessControl,
    TrustLayer: TrustLayer,
    TrustBoundaries: TrustBoundaries,
    TemporalReasoning: TemporalReasoning,
    TreasuryOps: TreasuryOps,
    ScenarioSimulator: ScenarioSimulator,
    FeedbackLoop: FeedbackLoop,
    Certify: Certify,
    PredictionRiskMap: PredictionRiskMap,
    Schedulers: Schedulers,
    SystemStatus: SystemStatus,
    DataVault: DataVault,
    IdentityGraph: IdentityGraph,
    Exports: Exports,
    AgentControls: AgentControls,
    Forensics: Forensics,
    TrainingDataLab: TrainingDataLab,
    MetricsDesign: MetricsDesign,
    EmergencyActions: EmergencyActions,
    DecisionHistory: DecisionHistory,
    QuorumGovernance: QuorumGovernance,
    ComponentStore: ComponentStore,
    NeuralPolicyComposer: NeuralPolicyComposer,
    TrustTruthEngine: TrustTruthEngine,
    ConstitutionalGuard: ConstitutionalGuard,
    UserSettings: UserSettings,
    Notifications: Notifications,
    ArchitectureExport_DatabaseSchema: ArchitectureExport_DatabaseSchema,
    ArchitectureExport_APIEndpoints: ArchitectureExport_APIEndpoints,
    ArchitectureExport_MigrationGuide: ArchitectureExport_MigrationGuide,
    ArchitectureExport_ComponentStructure: ArchitectureExport_ComponentStructure,
    ArchitectureExport_BackendStructure: ArchitectureExport_BackendStructure,
    ArchitectureExport_SystemAlignment: ArchitectureExport_SystemAlignment,
    ProductionMigrationGuide: ProductionMigrationGuide,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Protected Route Component
function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            // Check if user is authenticated (tokens are in httpOnly cookies)
            const isAuth = auth.isAuthenticated();
            setIsAuthenticated(isAuth);
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        // Loading state
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#0f0520] to-[#1a0b2e] flex items-center justify-center">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }
    
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
                <ProtectedRoute>
                    <Layout currentPageName="Dashboard">
                        <Dashboard />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Layout currentPageName="Dashboard">
                        <Dashboard />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/contracts" element={
                <ProtectedRoute>
                    <Layout currentPageName="Contracts">
                        <Contracts />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/tokenanalytics" element={
                <ProtectedRoute>
                    <Layout currentPageName="TokenAnalytics">
                        <TokenAnalytics />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/markets" element={
                <ProtectedRoute>
                    <Layout currentPageName="Markets">
                        <Markets />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/oracles" element={
                <ProtectedRoute>
                    <Layout currentPageName="Oracles">
                        <Oracles />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/auditlogs" element={
                <ProtectedRoute>
                    <Layout currentPageName="AuditLogs">
                        <AuditLogs />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/alerts" element={
                <ProtectedRoute>
                    <Layout currentPageName="Alerts">
                        <Alerts />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/compliance" element={
                <ProtectedRoute>
                    <Layout currentPageName="Compliance">
                        <Compliance />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/securityposture" element={
                <ProtectedRoute>
                    <Layout currentPageName="SecurityPosture">
                        <SecurityPosture />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/policies" element={
                <ProtectedRoute>
                    <Layout currentPageName="Policies">
                        <Policies />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/riskmanagement" element={
                <ProtectedRoute>
                    <Layout currentPageName="RiskManagement">
                        <RiskManagement />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/datagovernance" element={
                <ProtectedRoute>
                    <Layout currentPageName="DataGovernance">
                        <DataGovernance />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/aigovernance" element={
                <ProtectedRoute>
                    <Layout currentPageName="AIGovernance">
                        <AIGovernance />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/neuralintelligence" element={
                <ProtectedRoute>
                    <Layout currentPageName="NeuralIntelligence">
                        <NeuralIntelligence />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/automationengine" element={
                <ProtectedRoute>
                    <Layout currentPageName="AutomationEngine">
                        <AutomationEngine />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/explainabilitycenter" element={
                <ProtectedRoute>
                    <Layout currentPageName="ExplainabilityCenter">
                        <ExplainabilityCenter />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/deviationmonitor" element={
                <ProtectedRoute>
                    <Layout currentPageName="DeviationMonitor">
                        <DeviationMonitor />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/aiactionslog" element={
                <ProtectedRoute>
                    <Layout currentPageName="AIActionsLog">
                        <AIActionsLog />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/accesscontrol" element={
                <ProtectedRoute>
                    <Layout currentPageName="AccessControl">
                        <AccessControl />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/trustlayer" element={
                <ProtectedRoute>
                    <Layout currentPageName="TrustLayer">
                        <TrustLayer />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/trustboundaries" element={
                <ProtectedRoute>
                    <Layout currentPageName="TrustBoundaries">
                        <TrustBoundaries />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/temporalreasoning" element={
                <ProtectedRoute>
                    <Layout currentPageName="TemporalReasoning">
                        <TemporalReasoning />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/treasuryops" element={
                <ProtectedRoute>
                    <Layout currentPageName="TreasuryOps">
                        <TreasuryOps />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/scenariosimulator" element={
                <ProtectedRoute>
                    <Layout currentPageName="ScenarioSimulator">
                        <ScenarioSimulator />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/feedbackloop" element={
                <ProtectedRoute>
                    <Layout currentPageName="FeedbackLoop">
                        <FeedbackLoop />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/certify" element={
                <ProtectedRoute>
                    <Layout currentPageName="Certify">
                        <Certify />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/predictionriskmap" element={
                <ProtectedRoute>
                    <Layout currentPageName="PredictionRiskMap">
                        <PredictionRiskMap />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/schedulers" element={
                <ProtectedRoute>
                    <Layout currentPageName="Schedulers">
                        <Schedulers />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/systemstatus" element={
                <ProtectedRoute>
                    <Layout currentPageName="SystemStatus">
                        <SystemStatus />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/datavault" element={
                <ProtectedRoute>
                    <Layout currentPageName="DataVault">
                        <DataVault />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/identitygraph" element={
                <ProtectedRoute>
                    <Layout currentPageName="IdentityGraph">
                        <IdentityGraph />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/exports" element={
                <ProtectedRoute>
                    <Layout currentPageName="Exports">
                        <Exports />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/agentcontrols" element={
                <ProtectedRoute>
                    <Layout currentPageName="AgentControls">
                        <AgentControls />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/forensics" element={
                <ProtectedRoute>
                    <Layout currentPageName="Forensics">
                        <Forensics />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/trainingdatalab" element={
                <ProtectedRoute>
                    <Layout currentPageName="TrainingDataLab">
                        <TrainingDataLab />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/metricsdesign" element={
                <ProtectedRoute>
                    <Layout currentPageName="MetricsDesign">
                        <MetricsDesign />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/emergencyactions" element={
                <ProtectedRoute>
                    <Layout currentPageName="EmergencyActions">
                        <EmergencyActions />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/decisionhistory" element={
                <ProtectedRoute>
                    <Layout currentPageName="DecisionHistory">
                        <DecisionHistory />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/quorumgovernance" element={
                <ProtectedRoute>
                    <Layout currentPageName="QuorumGovernance">
                        <QuorumGovernance />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/componentstore" element={
                <ProtectedRoute>
                    <Layout currentPageName="ComponentStore">
                        <ComponentStore />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/neuralpolicycomposer" element={
                <ProtectedRoute>
                    <Layout currentPageName="NeuralPolicyComposer">
                        <NeuralPolicyComposer />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/trusttruthengine" element={
                <ProtectedRoute>
                    <Layout currentPageName="TrustTruthEngine">
                        <TrustTruthEngine />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/constitutionalguard" element={
                <ProtectedRoute>
                    <Layout currentPageName="ConstitutionalGuard">
                        <ConstitutionalGuard />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/usersettings" element={
                <ProtectedRoute>
                    <Layout currentPageName="UserSettings">
                        <UserSettings />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/notifications" element={
                <ProtectedRoute>
                    <Layout currentPageName="Notifications">
                        <Notifications />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/architectureexport_databaseschema" element={
                <ProtectedRoute>
                    <Layout currentPageName="ArchitectureExport_DatabaseSchema">
                        <ArchitectureExport_DatabaseSchema />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/architectureexport_apiendpoints" element={
                <ProtectedRoute>
                    <Layout currentPageName="ArchitectureExport_APIEndpoints">
                        <ArchitectureExport_APIEndpoints />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/architectureexport_migrationguide" element={
                <ProtectedRoute>
                    <Layout currentPageName="ArchitectureExport_MigrationGuide">
                        <ArchitectureExport_MigrationGuide />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/architectureexport_componentstructure" element={
                <ProtectedRoute>
                    <Layout currentPageName="ArchitectureExport_ComponentStructure">
                        <ArchitectureExport_ComponentStructure />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/architectureexport_backendstructure" element={
                <ProtectedRoute>
                    <Layout currentPageName="ArchitectureExport_BackendStructure">
                        <ArchitectureExport_BackendStructure />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/architectureexport_systemalignment" element={
                <ProtectedRoute>
                    <Layout currentPageName="ArchitectureExport_SystemAlignment">
                        <ArchitectureExport_SystemAlignment />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/productionmigrationguide" element={
                <ProtectedRoute>
                    <Layout currentPageName="ProductionMigrationGuide">
                        <ProductionMigrationGuide />
                    </Layout>
                </ProtectedRoute>
            } />
        </Routes>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}