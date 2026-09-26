import { User } from '../types/user';
import { Question, QuestionResult, TestResult } from '../types/test';
import { INITIAL_TEST_QUESTIONS } from '../data/tests';
import { StorageService } from '../services/storage';
import { ProgressService } from '../services/progress';
import { I18n } from '../services/i18n';

const NEXT_LEVEL: Record<User['currentLevel'], User['currentLevel'] | null> = {
  A1: 'A2',
  A2: 'B1',
  B1: null
};

export function renderLevelCheckPage(user: User, onComplete: () => void): HTMLElement {
  const container = document.createElement('div');
  container.className = 'page-container level-check-page';
  const isRu = I18n.getLang() === 'ru';
  const nextLevel = NEXT_LEVEL[user.currentLevel];
  let questions: Question[] = [];
  let index = 0;
  let score = 0;
  let details: QuestionResult[] = [];

  const renderIntro = () => {
    container.innerHTML = `
      <section class="today-heading"><div class="today-kicker">${isRu ? 'ДИАГНОСТИКА' : 'LEVEL CHECK'}</div><h2>${isRu ? 'Проверка уровня' : 'Check your level'}</h2><p>${isRu ? 'Короткий тест. Только если ты сам(а) готов(а).' : 'A short test, whenever you feel ready.'}</p></section>
      <section class="intake-panel level-check-intro"><div class="level-check-levels"><strong>${user.currentLevel}</strong><span>→</span><strong>${nextLevel || 'B1'}</strong></div>
        <p>${nextLevel ? (isRu ? `Ответь на 5 вопросов уровня ${nextLevel}. Для перехода нужно набрать не менее 4 правильных ответов.` : `Answer 5 ${nextLevel} questions. Get at least 4 right to move up.`) : (isRu ? 'Ты уже на уровне B1. Повторный тест поможет проверить знания.' : 'You are already at B1. Retake the check to review your skills.')}</p>
        <button class="btn btn-primary" id="start-level-check">${isRu ? 'Начать тест' : 'Start check'}</button>
      </section>`;
    container.querySelector('#start-level-check')?.addEventListener('click', startTest);
  };

  const startTest = () => {
    const difficulty = nextLevel || user.currentLevel;
    questions = INITIAL_TEST_QUESTIONS.filter((question) => question.difficulty === difficulty).slice(0, 5);
    if (!questions.length) {
      container.innerHTML = `<section class="intake-panel"><p>${isRu ? 'Для этого уровня пока нет вопросов.' : 'No questions are available for this level yet.'}</p><button class="btn btn-secondary" id="back-today">${isRu ? 'Назад' : 'Back'}</button></section>`;
      container.querySelector('#back-today')?.addEventListener('click', onComplete);
      return;
    }
    index = 0;
    score = 0;
    details = [];
    renderQuestion();
  };

  const renderQuestion = () => {
    const question = questions[index];
    container.innerHTML = `
      <section class="today-heading"><div class="today-kicker">${isRu ? 'ПРОВЕРКА УРОВНЯ' : 'LEVEL CHECK'}</div><h2>${index + 1} / ${questions.length}</h2><div class="today-progress-track"><span style="width:${Math.round(index / questions.length * 100)}%"></span></div></section>
      <section class="intake-panel level-question"><p class="level-question-text">${question.question}</p><div class="level-options">${question.options.map((option, optionIndex) => `<button class="level-option" data-option="${optionIndex}">${option}</button>`).join('')}</div></section>`;
    container.querySelectorAll<HTMLButtonElement>('.level-option').forEach((button) => {
      button.addEventListener('click', () => {
        const answer = question.options[Number(button.dataset.option)];
        const correct = answer === question.correctAnswer;
        if (correct) score += 1;
        details.push({
          questionId: question.id,
          questionText: question.question,
          userAnswer: answer,
          correctAnswer: question.correctAnswer,
          isCorrect: correct,
          explanation: question.explanation,
          category: question.category
        });
        index += 1;
        if (index < questions.length) renderQuestion();
        else renderResult();
      });
    });
  };

  const renderResult = () => {
    const passed = score >= 4;
    const promoted = passed && nextLevel !== null;
    const grammar = details.filter((result) => result.category === 'grammar');
    const phrases = details.filter((result) => result.category === 'phrases');
    const sentenceBuilding = details.filter((result) => result.category === 'sentence_building' || result.category === 'reading');
    const result: TestResult = {
      id: `level-check-${Date.now()}`,
      date: new Date().toISOString(),
      score,
      total: questions.length,
      percentage: Math.round(score / questions.length * 100),
      breakdown: {
        grammar: { correct: grammar.filter((item) => item.isCorrect).length, total: grammar.length },
        phrases: { correct: phrases.filter((item) => item.isCorrect).length, total: phrases.length },
        sentenceBuilding: { correct: sentenceBuilding.filter((item) => item.isCorrect).length, total: sentenceBuilding.length }
      },
      details
    };
    StorageService.saveTestResult(result);
    if (promoted) {
      const savedUser = StorageService.getUser() || user;
      savedUser.currentLevel = nextLevel;
      StorageService.saveUser(savedUser);
      ProgressService.addXp(50, isRu ? `Переход на уровень ${nextLevel}` : `Advanced to ${nextLevel}`);
    }
    container.innerHTML = `
      <section class="today-heading"><div class="today-kicker">${isRu ? 'ГОТОВО' : 'COMPLETE'}</div><h2>${promoted ? (isRu ? `Новый уровень: ${nextLevel}!` : `You reached ${nextLevel}!`) : (passed ? (isRu ? 'Отличный результат' : 'Strong result') : (isRu ? 'Продолжай практиковаться' : 'Keep practicing'))}</h2><p>${isRu ? `Правильных ответов: ${score} из ${questions.length}` : `Correct answers: ${score} of ${questions.length}`}</p></section>
      <section class="intake-panel level-check-result"><div class="level-result-score">${score}<small>/${questions.length}</small></div><p>${promoted ? (isRu ? 'Новый уровень сохранён в твоём профиле.' : 'Your new level has been saved to your profile.') : (isRu ? 'Прогресс сохранён. Попробуй ещё раз, когда почувствуешь уверенность.' : 'Your progress is saved. Try again when you feel ready.')}</p><button class="btn btn-primary" id="finish-level-check">${isRu ? 'На сегодня' : 'Back to today'}</button></section>`;
    container.querySelector('#finish-level-check')?.addEventListener('click', onComplete);
  };

  renderIntro();
  return container;
}