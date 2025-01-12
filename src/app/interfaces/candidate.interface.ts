export interface Candidate {
    id: string;
    name: string;
    profile: string;
}

export interface Skill {
  skill_name: string;
  skill_type: 'duro' | 'blando';
}

export interface Education {
  años: string;
  titulo: string;
  universidad: string;
}

export interface Experience {
  años: string;
  cargo: string;
  descripcion: string;
  empresa: string;
}

export interface MatchedSkill {
  score: number;
  skill: string;
}

export interface CandidateData {
  _id: string;
  conocimientos: string[];
  educacion: Education[];
  email: string;
  experiencia: Experience[];
  idiomas: string[];
  nombre: string;
  perfil: string;
  skills: Skill[];
  telefono: string;
  ubicacion: string;
}

export interface CandidateResult {
  json_data: CandidateData;
  matched_skills: MatchedSkill[];
}

// Interfaz principal que usará el servicio
export interface SearchResponse {
  prompt?: string;
  result: CandidateResult[];
  searched_skills?: string[];
  status?: number;
  msg?: string;
}
