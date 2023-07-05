import {Component, NgZone, OnInit} from '@angular/core';
import {CodeeditorService} from "../../../services/codeeditor/codeeditor.service";
import {ExerciseService} from "../../../services/exercise/exercise.service";
import {ActivatedRoute} from "@angular/router";
import {ElectronService} from "ngx-electron";
import {Question} from "../../../model/question/question.model";
import {Answer} from "../../../model/question/answer.model";
import {MatCheckbox} from "@angular/material/checkbox";
import {ExerciseConfiguration} from "../../../model/exercise/ExerciseConfiguration.model";

@Component({
  selector: 'app-check-game-core',
  templateUrl: './check-game-core-route.component.html',
  styleUrls: ['./check-game-core-route.component.css']
})
export class CheckGameCoreRouteComponent implements OnInit {
  exerciseName = this.route.snapshot.params['exercise'];
  exerciseRetrievalType !: number;
  actualQuestionNumber: number = 0;

  questions !: Question[];
  selectedAnswers: Answer[] = []
  exerciseConfiguration!: ExerciseConfiguration


  exerciseCompleted:boolean = false;
  score: number = 0;
  constructor(private codeService: CodeeditorService,
              private exerciseService: ExerciseService,
              private route:ActivatedRoute,
              private _electronService: ElectronService,
              private zone:NgZone)
  {

    // GET CONFIG CLASS FROM ELECTRON
    this._electronService.ipcRenderer.on('receiveConfigFilesFromLocal',(event,data)=>{
      this.zone.run( () => {
        this.setupQuestions(data);
      })
    })

  }

  ngOnInit(): void {
    this.exerciseRetrievalType = Number(localStorage.getItem("exerciseRetrieval"));

    // INIT PRODUCTION CLASS FROM LOCAL
    if(this.exerciseRetrievalType == 1){
      this.exerciseService.initConfigCodeFromLocal(this.exerciseName);
      // INIT PRODUCTION CLASS FROM CLOUD
    }else if(this.exerciseRetrievalType == 2){
      this.exerciseService.getConfigFile(this.exerciseName).subscribe(data=>{
        this.setupQuestions(data);
      })
    }

  }

  private setupQuestions(data: any) {
    this.exerciseConfiguration = data;
    this.questions = data.check_game_configuration.questions
  }

  selectAnswer(option: Answer) {
    this.clearCheckboxes();
    this.selectedAnswers[this.actualQuestionNumber] = option;
    option.isChecked = true;
  }

  goForward() {
    console.log(this.questions.length - 1)
    if(this.actualQuestionNumber < this.questions.length - 1){
      this.actualQuestionNumber = this.actualQuestionNumber + 1;
    }
  }

  goBackward() {
    if(this.actualQuestionNumber > 0){
      this.actualQuestionNumber = this.actualQuestionNumber - 1;
    }
  }

  showResults(){
    this.exerciseCompleted = true;
    this.calculateScore();
  }

  changeCheckbox(checkbox: MatCheckbox) {
    checkbox.checked = true;
  }

  calculateScore(){
    this.selectedAnswers.forEach((answer)=>{
      if(answer.isCorrect == true)
        this.score += 1;
    })
  }

  private clearCheckboxes() {
    this.questions[this.actualQuestionNumber].answers.forEach((element)=>{
      element.isChecked = false;
    });
  }
}
