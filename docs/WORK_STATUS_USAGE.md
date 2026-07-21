# Использование WORK_STATUS.md

Этот короткий пример показывает, как обновлять `WORK_STATUS.md` при переходе между устройствами.

## Начало задачи

```text
Status: IN_PROGRESS
Goal: одна конкретная цель
Branch: feat/example
Planned files: file-a, file-b
Next action: первый точный шаг
```

## Пауза

```text
Status: PAUSED
Last commit: точный SHA
Completed: фактически выполненные пункты
Not completed: оставшиеся пункты
Next action: одна команда или одно изменение
```

## Завершение

```text
Status: READY
Completed: итог задачи
Checks: фактически выполненные проверки
PR / merge / release: ссылки или номера
Next approved task: следующая граница из ROADMAP.md
```

Главное правило: другой человек или устройство должны понять состояние работы, прочитав только `WORK_STATUS.md`, без восстановления контекста из чата.
