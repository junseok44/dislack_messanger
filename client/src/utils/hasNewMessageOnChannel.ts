export const hasNewMessageOnChannel = (
  lastMessageId: number | null,
  lastSeenMessageId: number | null
) => {
  if (!lastMessageId) return false;

  let parsedLastSeenId = lastSeenMessageId || 0;

  return lastMessageId > parsedLastSeenId;
};
