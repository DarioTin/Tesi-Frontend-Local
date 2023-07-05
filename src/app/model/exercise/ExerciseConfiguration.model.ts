import {Question} from "../question/question.model";

export class ExerciseConfiguration {
  refactoring_game_configuration!: {
    'dependencies': string,
    'refactoring_limit': number,
    'smells_allowed': number
  };
  check_game_configuration!: {
    'questions': Question[]
  };
  auto_valutative!: boolean;
}
