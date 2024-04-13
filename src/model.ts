import {ProjectData, SceneData, ShotData} from './persistence.ts'

export class Project {
  constructor(
    private data: ProjectData,
  ) {
  }

  get name(): string {
    return this.data.name
  }

  get scenes(): Scene[] {
    const scenes: Scene[] = []
    this.data.scenes.forEach(data => {
      const previousCode = scenes[scenes.length - 1]?.code ?? 0
      scenes.push(new Scene(previousCode + 1, data))
    })
    return scenes
  }
}

export class Scene {
  constructor(
    private autoCode: number,
    private data: SceneData,
  ) {
  }

  get code(): number {
    return this.data.frozenCode ?? this.autoCode
  }

  get isCodeFrozen(): boolean {
    return !!this.data.frozenCode
  }

  freezeCode() {
    if (this.data.frozenCode) {
      throw Error('Scene Code is already frozen')
    }
    this.data.frozenCode = this.autoCode
  }

  get name(): string {
    return this.data.name
  }

  get shots(): Shot[] {
    const shots: Shot[] = []
    this.data.shots.forEach(data => {
      const previousCode = shots[shots.length - 1]?.code ?? 0
      shots.push(new Shot(previousCode + 1, data))
    })
    return shots
  }
}

export class Shot {
  constructor(
    private autoCode: number,
    private data: ShotData,
  ) {
  }

  get code(): number {
    return this.data.frozenCode ?? this.autoCode
  }

  get isCodeFrozen(): boolean {
    return !!this.data.frozenCode
  }

  freezeCode() {
    if (this.data.frozenCode) {
      throw Error('Shot Code is already frozen')
    }
    this.data.frozenCode = this.autoCode
  }

  get description(): string {
    return this.data.description
  }

  get location(): string | null {
    return this.data.location
  }

  get notes(): string {
    return this.data.notes
  }

  get animated(): boolean {
    return this.data.animated
  }
}
