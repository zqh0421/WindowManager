// // User.ts
// export interface User {
//   UserID: string;
//   Username: string;
//   Email: string;
//   RegistrationDate: Date | string;
//   IsVip: number; // 0 or 1 in SQLite, but boolean in practice
//   VipTimeLimit?: Date | string;
//   taskLimit: number;
// }

// // LayoutSelectionHistory.ts
// export interface LayoutSelectionHistory {
//   SelectionID: number;
//   LayoutID: number;
//   Timestamp: Date | string;
// }

// // CommandHistory.ts
// export interface CommandHistory {
//   CommandID: number;
//   CommandText: string;
//   ExecutionTime: Date | string;
//   IsSatisfied?: number; // Optional, as it might not always be set
// }

// // AppActivity.ts
// export interface AppActivity {
//   UsageID: number;
//   AppName: string;
//   WindowTitle: string;
//   WindowSize: string; // Format: 'width, height'
//   WindowPosition: string; // Format: 'x, y'
//   RecordedTime: number; // Stored in seconds
// }

// // Layout.ts
// export interface Layout {
//   LayoutID: number;
//   LayoutType: string;
//   Timestamp: Date | string;
// }

// // LayoutDetail.ts
// export interface LayoutDetail {
//   DetailID: number;
//   LayoutID: number;
//   Position: string;
//   AppName: string;
//   AppPath: string;
//   WindowName: string;
//   Size: string; // Could be detailed as width and height or another format
// }

// // Task.ts
// export interface Task {
//   taskID: number;
//   taskName: string;
//   taskDescription?: string;
//   taskType: string;
//   taskStatus: string;
//   taskPriority: string;
//   taskDeadline?: Date | string;
//   taskCreationTime: Date | string;
//   taskCompletionTime?: Date | string;
//   taskCompletionDescription?: string;
//   taskCompletionStatus?: string;
//   taskCompletionRating?: number;
//   taskCompletionFeedback?: string;
// }
