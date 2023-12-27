import { Component, HostListener } from '@angular/core';
import * as questions from '../../assets/question.json';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoxComponent } from '../box/box.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  data: any = questions;
  url = '../assets/question.json'
  timeLeftSec: number = 59;
  timeLeftMin: number = 10;
  result: any;
  isButtonDisabled = false;
  interval: any;
  questionSet: any;
  quizQuestions: any[] = [];
  htmlQuizQuestions: any[] = [];
  jsQuizQuestions: any[] = [];
  cssQuizQuestions: any[] = [];

  currentQuestionIndex = 0;
  selectedAnswer: string | null = null;
  quizCompleted = false;
  count = 0;
  isenabled = true;

  isDropdownDisabled = false;
  selectedValue: string = '';

  timeoutId: any;
  verifyData = false;

  userverifyAnswers =[];

  constructor(public http: HttpClient, private snackBar: MatSnackBar, public dialog: MatDialog) { }
  ngOnInit() { }

  dropdownOptions = [
    { value: 'HTML', label: 'HTML' },
    { value: 'CSS', label: 'CSS' },
    { value: 'JavaScript', label: 'JAVASCRIPT' },
    { value: 'ALL', label: 'MIX(HTML,CSS& JAVASCRIPT)' },

  ];


  onSelectionChange() {
    this.isDropdownDisabled = true;



    this.timeoutId = setTimeout(() => {
      this.isDropdownDisabled = false;
    }, 11 * 60 * 1000);




    // Handle selection change here if needed
    console.log('Selected Value:', this.selectedValue);
    this.http.get<any[]>(this.url).subscribe({
      next: (data) => {
        // this.quizQuestions = data;
        if (this.selectedValue === "HTML") {
          this.quizQuestions = data.filter(item => item.type === "HTML");

        }
        if (this.selectedValue === "CSS") {
          this.quizQuestions = data.filter(item => item.type === "CSS");
        }
        if (this.selectedValue === "JavaScript") {
          this.quizQuestions = data.filter(item => item.type === "JavaScript");
        }
        if (this.selectedValue === "ALL") {
          this.quizQuestions = data;
        }

      }
    })

    this.startTimer();

    return 0
  }

  startTimer() {
    if (!this.isButtonDisabled) {
      this.isButtonDisabled = true;
      setTimeout(() => {
        this.isButtonDisabled = false;
      }, 1000);
    }
    if (this.timeLeftMin === 0 && this.timeLeftSec === 0 && !this.quizCompleted) {
      this.openDialog();
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      if (this.timeLeftMin === 0 && this.timeLeftSec === 0) {
        this.openDialog();
        this.quizCompleted = true;
        clearInterval(this.interval);
      }

      else {
        if (this.timeLeftSec === 0) {
          this.timeLeftMin--;
          this.timeLeftSec = 59;
        } else {
          this.timeLeftSec--;

        }

      }
    }, 1000)
  }


  getCurrentQuestion() {
    return this.quizQuestions[this.currentQuestionIndex];
  }


  getCorrectAnswer(str: any): string {
    return this.getCurrentQuestion().correct;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }

  }


  selectAnswer(answer: string) {
    console.log(answer)
    this.selectedAnswer = answer;
    if (this.selectedAnswer === this.getCurrentQuestion().correct) {
      this.count = this.count + 1;
      console.log(this.count);
    }
    console.log(this.count);

  }

  calculateAccuracy(): number {
    const totalQuestions = this.quizQuestions.length;
    var dgitn = (this.count / totalQuestions) * 100;
    if (dgitn > 50) {
      this.result = "PASS";
    }
    else {
      this.result = "FAIL";
    }
    return (this.count / totalQuestions) * 100;
  }


  showQuizResultsSnackbar() {
    const accuracy = this.calculateAccuracy();
    const message = `Quiz completed! You answered with ${accuracy}% accuracy.`;
    this.snackBar.open(message, 'Close', {
      duration: 5000,
    });
  }

  finishQuiz() {
    this.timeLeftSec = 59;
    this.timeLeftMin = 10;
    clearInterval(this.interval);
    this.showQuizResultsSnackbar();
    console.log('Quiz finished!');
    this.quizCompleted = true;
  }
  retake() {
    this.quizCompleted = false;
    this.currentQuestionIndex = 0
    this.timeLeftSec = 59;
    this.timeLeftMin = 10;
    this.startTimer();
    this.isDropdownDisabled = true;

  }


  openDialog() {
    const dialogRef = this.dialog.open(BoxComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }


  // verifyAnswers() {
  //   console.log(this.quizQuestions);
  //   const questionSet= this.getCurrentQuestion().question
  //   const answerSet = this.getCurrentQuestion().correct
  //   console.log(answerSet)
  // }


  reset() {
    this.timeLeftSec = 59;
    this.timeLeftMin = 10;
    clearTimeout(this.timeoutId);
    clearInterval(this.interval);
    this.isDropdownDisabled = true;
    this.showQuizResultsSnackbar();
    console.log('Quiz finished!');
    this.openDialog();
    this.quizCompleted = true;

  }
  verifyAnswers() {
    

    this.verifyData = true;
    console.log(this.quizQuestions)
  }
  
}
