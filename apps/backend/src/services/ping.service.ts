export function pingService(message: string) {
    return {
      reply: `pong: ${message}`,
    };
  }
  