import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, NgForm} from "@angular/forms";
import {environment} from "../../../environments/environment.prod";
import {UserService} from "../../services/user/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SettingsService} from "../../services/settings/settings.service";
import {ElectronService} from "ngx-electron";

@Component({
  selector: 'app-settings-route',
  templateUrl: './settings-route.component.html',
  styleUrls: ['./settings-route.component.css']
})
export class SettingsRouteComponent implements OnInit {

  environmentForm: any;
  compileType!: number;
  exerciseType!: number;
  isUserAuthenticated!: boolean;
  constructor(private fb: FormBuilder,
              private userService: UserService,
              private _snackBar: MatSnackBar,
              private settingsService: SettingsService,
              private _electronService: ElectronService,
              private zone:NgZone) {
    this._electronService.ipcRenderer.on('receiveDependenciesCheck', (event, data)=>{
      this.zone.run(()=>{
        if(data[0] == false)
          this._snackBar.open("To use Local Compile mode you need to install Maven", "Close", {
            duration: 3000
          });

        if(data[1] == false)
          this._snackBar.open("To use Local Compile mode you need to install Java", "Close", {
            duration: 3000
          });
        })
    })
  }

  ngOnInit(): void {
    this.fillEnvironmentForm();
    this.compileType = Number(localStorage.getItem("compileMode"));
    this.exerciseType = Number(localStorage.getItem("exerciseRetrieval"));
    console.log("Exercise type : " + this.exerciseType);
    this.isUserAuthenticated = this.userService.user.getValue() !== null;
  }

  fillEnvironmentForm() {
    this.environmentForm = this.fb.group({
      user_service: environment.userServiceUrl,
      compiler_service: environment.compilerServiceUrl,
      exercise_service: environment.exerciseServiceUrl,
      leaderboard_service: environment.leaderboardServiceUrl
    })

  }


  clickCompileCheckbox(compileType: number) {
    this.settingsService.checkDependencies();
    this.compileType = compileType;
  }

  clickExerciseCheckbox(number: number) {
    this.settingsService.checkDependencies();
    this.exerciseType = number;
  }

  submitEnvironmentForm(environmentForm: any) {
    environment.userServiceUrl = environmentForm.value.user_service
    environment.compilerServiceUrl = environmentForm.value.compiler_service
    environment.leaderboardServiceUrl = environmentForm.value.leaderboard_service
    environment.exerciseServiceUrl = environmentForm.value.exercise_service

    this._snackBar.open("Settings saved", "Close", {
      duration: 3000
    });
  }

  submitCompileCheckboxes(checkboxForm: NgForm) {
    localStorage.setItem("compileMode", this.compileType.toString());

    this._snackBar.open("Settings saved", "Close", {
        duration: 3000
    });
  }

  submitExerciseCheckboxes(checkboxForm: NgForm) {
    localStorage.setItem("exerciseRetrieval", this.exerciseType.toString());
    this._snackBar.open("Settings saved", "Close", {
      duration: 3000
    });
  }


}
