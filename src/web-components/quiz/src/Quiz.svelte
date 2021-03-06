<script>
  import { onMount, tick } from 'svelte';

  export let options;

  $: questions = Array.from(JSON.parse(options).questions);

  onMount(() => {
    tick().then(() => {
      const codeBlocks = document.querySelector('nk-quiz').shadowRoot.querySelectorAll('.quiz-code-block');

      codeBlocks.forEach((block) => {
        Prism.highlightElement(block);
      });
    });
  });
</script>

<style lang="scss">
  @import 'prism';

  .hidden {
    opacity: 0;
    font-size: 0.1px;
    position: absolute;
  }

  .quiz {
    width: 100%;

    &__question {
      font-size: var(--font-size-2);

      &-block {
        width: 100%;

        * + * {
          margin-top: var(--spacing-1);
        }
      }
    }

    &__answer--multiple {
      position: relative;

      label {
        border: 1px solid var(--light-purple);
        padding: var(--spacing-0) var(--spacing-1);
        cursor: pointer;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: var(--border-radius-normal);
        transition: background-color 0.2s linear;
        box-sizing: border-box;
        border: 2px solid currentColor;

        &:hover,
        &:focus {
          background-color: var(--lightest);
        }

        .quiz__answer-icon {
          display: none;
          margin-left: var(--spacing-0);
        }
      }

      input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }

      input:checked + label {
        color: var(--lightest);
        @media (prefers-color-scheme: dark) {
          color: var(--darkest);
        }
        .quiz__answer-icon {
          display: initial;
        }
      }
    }

    &__answer-option {
      &--correct:checked + label {
        background-color: var(--success);
      }

      &--incorrect:checked + label {
        background-color: var(--danger);
      }
    }

    &__answer--answered {
      .quiz__answer-option--correct + label {
        background-color: var(--success);
        color: var(--lightest);
        @media (prefers-color-scheme: dark) {
          color: var(--darkest);
        }

        .quiz__answer-icon {
          display: initial;
        }
      }
    }

    &__answer {
      * + * {
        margin-top: var(--spacing-0);
      }
    }

    &__answer--single {
      display: flex;
      align-items: stretch;

      input {
        flex: 1;
        padding: var(--spacing-0);
      }

      button {
        display: block;
        background: var(--primary-dark);
        color: var(--lightest);
        padding: var(--spacing-0);
        margin: 0;
        border: none;
        border-radius: 0 var(--border-radius-normal) var(--border-radius-normal) 0;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity linear 0.2s;

        @media (prefers-color-scheme: dark) {
          color: var(--darkest);
        }
      }
    }

    &__corect-answer {
      background: var(--secondary);
      color: var(--lightest);
      padding: var(--spacing-0);
      border-radius: var(--border-radius-normal);
      @media (prefers-color-scheme: dark) {
        color: var(--darkest);
      }
    }
  }

  .gg-check {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs, 1));
    width: 22px;
    height: 22px;
    border: 2px solid transparent;
    border-radius: 100px;

    &:after {
      content: '';
      display: block;
      box-sizing: border-box;
      position: absolute;
      left: 3px;
      top: -1px;
      width: 6px;
      height: 10px;
      border-width: 0 2px 2px 0;
      border-style: solid;
      transform-origin: bottom left;
      transform: rotate(45deg);
    }
  }

  .gg-close {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs, 1));
    width: 22px;
    height: 22px;
    border: 2px solid transparent;
    border-radius: 40px;

    &:after,
    &:before {
      content: '';
      display: block;
      box-sizing: border-box;
      position: absolute;
      width: 16px;
      height: 2px;
      background: currentColor;
      transform: rotate(45deg);
      border-radius: 5px;
      top: 8px;
      left: 1px;
    }

    &:after {
      transform: rotate(-45deg);
    }
  }
</style>

<!-- your code here -->
<svelte:options tag={'nk-quiz'} />

<form class="quiz">
  {#each questions as question, questionIndex}
    <!-- content here -->
    <div class="quiz__question-block">
      <h3 class="quiz__question">{question.text}</h3>

      {#if question.snippet}
        <div class="code-toolbar">
          <pre class="language-{question.snippetLanguage}">
              <code
              class="language-{question.snippetLanguage} quiz-code-block ">
                  {question.snippet.code}
              </code>
            </pre>
        </div>
      {/if}

      <div class="quiz__answers">
        {#each question.answers as answer, answerIndex}
          <!-- content here -->

          <div class="quiz__answer--multiple quiz__answer {question.answered ? 'quiz__answer--answered' : ''}">
            <input
              on:click={() => {
                question.answered = true;
              }}
              class="quiz__answer-option {`quiz__answer-option--${question.correctIndex === answerIndex ? 'correct' : 'incorrect'}`}"
              type="radio"
              value={answer.label}
              id={`answer-${questionIndex}-${answerIndex}`}
              name={`answer-${questionIndex}`} />
            <label for={`answer-${questionIndex}-${answerIndex}`}>
              {answer.label}

              {#if question.correctIndex === answerIndex}
                <span class="quiz__answer-icon" aria-label="correct"><i class="gg-check" /></span>
              {:else}<span class="quiz__answer-icon" aria-label="incorrect"><i class="gg-close" /></span>{/if}
            </label>
          </div>
        {/each}

        {#each question.richAnswers as answer, answerIndex}
          <!-- content here -->

          <div
            class="quiz__answer--multiple quiz__answer quiz__answer--rich {question.answered ? 'quiz__answer--answered' : ''}">
            <input
              on:click={() => {
                question.answered = true;
              }}
              class="quiz__answer-option {`quiz__answer-option--${question.correctIndex === answerIndex ? 'correct' : 'incorrect'}`}"
              type="radio"
              value={answerIndex}
              id={`answer-${questionIndex}-${answerIndex}`}
              name={`answer-${questionIndex}`} />
            <label for={`answer-${questionIndex}-${answerIndex}`}>
              <div class="code-toolbar">
                <pre class="language-{question.language}">
                    <code
                    class="language-{question.language} quiz-code-block ">
                        {answer.label}
                    </code>
                  </pre>
              </div>

              {#if question.correctIndex === answerIndex}
                <span class="quiz__answer-icon" aria-label="correct"><i class="gg-check" /></span>
              {:else}<span class="quiz__answer-icon" aria-label="incorrect"><i class="gg-close" /></span>{/if}
            </label>
          </div>
        {/each}

        {#if question.answer}
          <!-- content here -->
          <div class="quiz__answer quiz__answer--single">
            <input id={`single-answer-${questionIndex}`} type="text" bind:value={question.textAnswer} />
            <label for={`single-answer-${questionIndex}`} class="hidden">Answer field</label>
            <button
              type="button"
              on:click={() => {
                question.answered = true;
              }}>Check answer</button>
          </div>
          {#if question.answered}
            <!-- content here -->
            <p class="quiz__corect-answer">{question.answer}</p>
          {/if}
        {/if}
      </div>
    </div>
  {/each}
</form>
