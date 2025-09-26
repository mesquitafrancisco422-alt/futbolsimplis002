export enum Championship {
  BRASILEIRAO = 'brasileirao',
  LIBERTADORES = 'libertadores',
  COPA_DO_BRASIL = 'copa_do_brasil',
  FAVORITES = 'favorites',
}

export interface Team {
  name: string;
  logoUrl: string;
}

export interface Broadcaster {
  name: string;
  url: string;
}

export interface Match {
  id: string;
  teams: [Team, Team];
  dateTime: string;
  broadcasters: Broadcaster[];
}
