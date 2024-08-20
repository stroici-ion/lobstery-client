export function getTime(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000) || 1;
  //seconds
  if (seconds < 60) return `${seconds} second${seconds > 1 ? 's' : ''} ago`;

  //minutes
  if (seconds >= 60 && seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  //hours
  if (seconds >= 3600 && seconds < 3600 * 24) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  //days
  if (seconds >= 3600 * 24 && seconds < 3600 * 24 * 30) {
    const days = Math.floor(seconds / (3600 * 24));
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  //months
  if (seconds >= 3600 * 24 * 30 && seconds < 3600 * 24 * 365) {
    const months = Math.floor(seconds / (3600 * 24 * 30));
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }

  //years
  if (seconds >= 3600 * 24 * 365) {
    const years = Math.floor(seconds / (3600 * 24 * 365));
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}
