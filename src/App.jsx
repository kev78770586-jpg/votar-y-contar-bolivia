import React from 'react';
import { useElectoral } from './context/ElectoralContext';
import MobileFrame from './components/MobileFrame';
import Navigation from './components/Navigation';

import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import MesaInfoScreen from './screens/MesaInfoScreen';
import VoteCountingScreen from './screens/VoteCountingScreen';
import ResultsSummaryScreen from './screens/ResultsSummaryScreen';
import ActaGeneratorScreen from './screens/ActaGeneratorScreen';
import ValidationScreen from './screens/ValidationScreen';
import SignaturesScreen from './screens/SignaturesScreen';
import DeliveryMaterialsScreen from './screens/DeliveryMaterialsScreen';
import HistoryReportsScreen from './screens/HistoryReportsScreen';

export default function App() {
  const { currentUser, activeScreen } = useElectoral();

  const renderActiveScreen = () => {
    if (!currentUser || activeScreen === 'login') {
      return <LoginScreen />;
    }

    switch (activeScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'mesainfo':
        return <MesaInfoScreen />;
      case 'counting':
        return <VoteCountingScreen />;
      case 'results':
        return <ResultsSummaryScreen />;
      case 'acta':
        return <ActaGeneratorScreen />;
      case 'validation':
        return <ValidationScreen />;
      case 'signatures':
        return <SignaturesScreen />;
      case 'delivery':
        return <DeliveryMaterialsScreen />;
      case 'history':
        return <HistoryReportsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  const isLogged = currentUser && activeScreen !== 'login';

  return (
    <MobileFrame>
      {isLogged && <Navigation />}
      {renderActiveScreen()}
    </MobileFrame>
  );
}
