import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { useI18n } from '../hooks/useI18n';

// Test component to verify i18n functionality
const TestComponent: React.FC = () => {
  const { t, changeLanguage, getCurrentLanguage } = useI18n();
  
  return (
    <div>
      <h1 data-testid="welcome-text">{t('common.welcome', { userName: 'Test User' })}</h1>
      <p data-testid="current-language">Current: {getCurrentLanguage()}</p>
      <button 
        data-testid="change-to-english" 
        onClick={() => changeLanguage('en')}
      >
        Switch to English
      </button>
      <button 
        data-testid="change-to-dutch" 
        onClick={() => changeLanguage('nl')}
      >
        Switch to Dutch
      </button>
      <button 
        data-testid="change-to-german" 
        onClick={() => changeLanguage('de')}
      >
        Switch to German
      </button>
      <button 
        data-testid="change-to-spanish" 
        onClick={() => changeLanguage('es')}
      >
        Switch to Spanish
      </button>
      <button 
        data-testid="change-to-french" 
        onClick={() => changeLanguage('fr')}
      >
        Switch to French
      </button>
      <button 
        data-testid="change-to-japanese" 
        onClick={() => changeLanguage('ja')}
      >
        Switch to Japanese
      </button>
      <button 
        data-testid="change-to-korean" 
        onClick={() => changeLanguage('ko')}
      >
        Switch to Korean
      </button>
      <span data-testid="chat-nav">{t('navigation.chat')}</span>
      <span data-testid="communities-nav">{t('navigation.communities')}</span>
      <span data-testid="settings-title">{t('settings.title')}</span>
      <span data-testid="loading-text">{t('common.loading')}</span>
      <span data-testid="save-button">{t('common.save')}</span>
    </div>
  );
};

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    {children}
  </I18nextProvider>
);

describe('i18n Implementation', () => {
  beforeEach(() => {
    // Reset to Dutch before each test
    i18n.changeLanguage('nl');
  });

  test('renders Dutch text by default', async () => {
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // Wait for i18n to initialize
    await screen.findByTestId('welcome-text');
    
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Welkom terug, Test User!');
    expect(screen.getByTestId('chat-nav')).toHaveTextContent('Chat');
    expect(screen.getByTestId('communities-nav')).toHaveTextContent('Community\'s');
    expect(screen.getByTestId('settings-title')).toHaveTextContent('⚙️ Instellingen');
    expect(screen.getByTestId('loading-text')).toHaveTextContent('Laden...');
    expect(screen.getByTestId('save-button')).toHaveTextContent('Opslaan');
  });

  test('switches language to English', async () => {
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    await screen.findByTestId('welcome-text');
    
    // Switch to English
    const englishButton = screen.getByTestId('change-to-english');
    englishButton.click();

    // Wait a moment for the language change to take effect
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check English translations
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Welcome back, Test User!');
    expect(screen.getByTestId('communities-nav')).toHaveTextContent('Communities');
    expect(screen.getByTestId('settings-title')).toHaveTextContent('⚙️ Settings');
    expect(screen.getByTestId('loading-text')).toHaveTextContent('Loading...');
    expect(screen.getByTestId('save-button')).toHaveTextContent('Save');
  });

  test('switches back to Dutch', async () => {
    // Set initial language to English
    i18n.changeLanguage('en');
    
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    await screen.findByTestId('welcome-text');
    
    // Switch to Dutch
    const dutchButton = screen.getByTestId('change-to-dutch');
    dutchButton.click();

    // Wait a moment for the language change to take effect
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check Dutch translations
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Welkom terug, Test User!');
    expect(screen.getByTestId('communities-nav')).toHaveTextContent('Community\'s');
    expect(screen.getByTestId('settings-title')).toHaveTextContent('⚙️ Instellingen');
  });

  test('switches language to German', async () => {
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    await screen.findByTestId('welcome-text');
    
    // Switch to German
    const germanButton = screen.getByTestId('change-to-german');
    germanButton.click();

    // Wait a moment for the language change to take effect
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check German translations
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Willkommen zurück, Test User!');
    expect(screen.getByTestId('communities-nav')).toHaveTextContent('Communities');
    expect(screen.getByTestId('settings-title')).toHaveTextContent('⚙️ Einstellungen');
    expect(screen.getByTestId('loading-text')).toHaveTextContent('Laden...');
    expect(screen.getByTestId('save-button')).toHaveTextContent('Speichern');
  });

  test('switches language to Spanish', async () => {
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    await screen.findByTestId('welcome-text');
    
    // Switch to Spanish
    const spanishButton = screen.getByTestId('change-to-spanish');
    spanishButton.click();

    // Wait a moment for the language change to take effect
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check Spanish translations
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('¡Bienvenido de nuevo, Test User!');
    expect(screen.getByTestId('communities-nav')).toHaveTextContent('Comunidades');
    expect(screen.getByTestId('settings-title')).toHaveTextContent('⚙️ Configuración');
    expect(screen.getByTestId('loading-text')).toHaveTextContent('Cargando...');
    expect(screen.getByTestId('save-button')).toHaveTextContent('Guardar');
  });

  test('switches language to French', async () => {
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    await screen.findByTestId('welcome-text');
    
    // Switch to French
    const frenchButton = screen.getByTestId('change-to-french');
    frenchButton.click();

    // Wait a moment for the language change to take effect
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check French translations
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Bienvenue Test User !');
    expect(screen.getByTestId('communities-nav')).toHaveTextContent('Communautés');
    expect(screen.getByTestId('settings-title')).toHaveTextContent('⚙️ Paramètres');
    expect(screen.getByTestId('loading-text')).toHaveTextContent('Chargement...');
    expect(screen.getByTestId('save-button')).toHaveTextContent('Enregistrer');
  });

  test('switches language to Japanese', async () => {
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    await screen.findByTestId('welcome-text');
    
    // Switch to Japanese
    const japaneseButton = screen.getByTestId('change-to-japanese');
    japaneseButton.click();

    // Wait a moment for the language change to take effect
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check Japanese translations
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Test Userさん、おかえりなさい！');
    expect(screen.getByTestId('communities-nav')).toHaveTextContent('コミュニティ');
    expect(screen.getByTestId('settings-title')).toHaveTextContent('⚙️ 設定');
    expect(screen.getByTestId('loading-text')).toHaveTextContent('読み込み中...');
    expect(screen.getByTestId('save-button')).toHaveTextContent('保存');
  });

  test('switches language to Korean', async () => {
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    await screen.findByTestId('welcome-text');
    
    // Switch to Korean
    const koreanButton = screen.getByTestId('change-to-korean');
    koreanButton.click();

    // Wait a moment for the language change to take effect
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check Korean translations
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Test User님, 다시 오신 것을 환영합니다!');
    expect(screen.getByTestId('communities-nav')).toHaveTextContent('커뮤니티');
    expect(screen.getByTestId('settings-title')).toHaveTextContent('⚙️ 설정');
    expect(screen.getByTestId('loading-text')).toHaveTextContent('로딩 중...');
    expect(screen.getByTestId('save-button')).toHaveTextContent('저장');
  });

  test('persists language choice in localStorage', () => {
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    const englishButton = screen.getByTestId('change-to-english');
    englishButton.click();

    // Check if language is stored in localStorage
    expect(localStorage.getItem('i18nextLng')).toBe('en');
  });
});