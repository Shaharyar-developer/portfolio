export const defaultReminderTemplate = {
  subject: "Reminder: {{task}} is due {{dueDate}}",
  body: [
    "<p>Hi,</p>",
    "<p>This is a reminder that <strong>{{task}}</strong> is due on {{dueDate}}.</p>",
    "<p>Please take the needed action when you can.</p>",
  ].join(""),
};

export const defaultRules = [
  {
    kind: "before_due" as const,
    offsetDays: 3,
  },
  {
    kind: "on_due" as const,
    offsetDays: 0,
  },
];
