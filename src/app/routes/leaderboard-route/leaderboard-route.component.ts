import {Component, NgZone, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {ElectronService} from "ngx-electron";
import {LeaderboardService} from "../../services/leaderboard/leaderboard.service";
import {Solution} from "../../model/solution/solution";
import {ExerciseService} from "../../services/exercise/exercise.service";

@Component({
  selector: 'app-leaderboard-route',
  templateUrl: './leaderboard-route.component.html',
  styleUrls: ['./leaderboard-route.component.css']
})
export class LeaderboardRouteComponent implements OnInit {

  solutions!: Solution[]
  exerciseCode!: string;
  testingCode!: string;
  exerciseType !: number;
  exerciseName = this.route.snapshot.params['exercise'];
  isAutoValutative!: boolean;

  constructor(private http: HttpClient,
              private router: Router,
              private _electronService: ElectronService,
              private leaderboardService: LeaderboardService,
              private exerciseService: ExerciseService,
              private zone:NgZone,
              private route:ActivatedRoute) {
    // GET TESTING CLASS FROM ELECTRON
    this._electronService.ipcRenderer.on('receiveTestingClassFromLocal',(event,data)=>{
      this.zone.run( () => {
        this.testingCode = data
      })
    })
    // GET CONFIG DATA FROM ELECTRON
    this._electronService.ipcRenderer.on('receiveConfigFilesFromLocal',(event,data)=>{
      this.zone.run( () => {
        console.log(data);
        this.setupConfigFiles(data);
      })
    })


  }

  ngOnInit(): void {
    this.exerciseType = Number(localStorage.getItem("exerciseRetrieval"));
    if(this.exerciseType == 1)
      this.exerciseService.initConfigCodeFromLocal(this.exerciseName);
    else
      this.exerciseService.getConfigFile(this.exerciseName).subscribe(data=>{this.setupConfigFiles(data);})

    if(!this.isAutoValutative)
      this.retrieveCode();

    this.leaderboardService.getSolutionsByExerciseName(this.exerciseName).subscribe(data=>{
      this.solutions = data;
    })

  }

  setupConfigFiles(data:any){
    this.isAutoValutative = data.auto_valutative;
  }

  retrieveCode(){
    // INIT CODE FROM LOCAL
    if(this.exerciseType == 1){
      this.exerciseService.initProductionCodeFromLocal(this.exerciseName);
      this.exerciseService.initTestingCodeFromLocal(this.exerciseName);
    }else if(this.exerciseType == 2){
      // INIT CODE FROM CLOUD
      this.exerciseService.getMainClass(this.exerciseName).subscribe( data=> {
        this.exerciseCode = data;
      });
      this.exerciseService.getTestClass(this.exerciseName).subscribe( data => {
        this.testingCode = data
      })
    }
  }

}
