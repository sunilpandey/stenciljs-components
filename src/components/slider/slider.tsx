import { Component, State, Element, Prop, EventEmitter, Event } from '@stencil/core'
@Component({
    tag: "slider-element",
    styleUrl: "slider.less",
})

export class Slider {
    private Left_Arrow = 37;
    private Right_Arrow = 39;
    @Prop() maxValue: number = 255;
    @Prop() tickSize: number = 50;
    @State() left: string;
    @State() allTickPoints: number[] = [];
    @State() totalTicks: number =0;

    @Element() sliderElement: HTMLElement;
    @Event() onValueUpdated: EventEmitter;

    private mouseDown: boolean;
    private mainContainer: HTMLElement;
    private draggerWidth: number;
    componentWillLoad() {
        this.left = "0px";
        document.addEventListener("mouseup", () => {
            this.mouseDown = false;
        })

        document.addEventListener("mousemove", ($event) => {
            this.changePosition($event)
        });
    }

    componentDidLoad() {
        this.mainContainer = this.sliderElement.querySelector('.main-container');
        this.mainContainer.parentElement.addEventListener("keydown", (event: KeyboardEvent) => {
            this.onKeyPress(event);
        })
        let dragger = this.sliderElement.querySelector('.dragger');
        this.draggerWidth = parseInt(window.getComputedStyle(dragger).width, 10) + 2;
        var width = parseInt(window.getComputedStyle(this.mainContainer).width, 10);
        this.allTickPoints = [];
        var tickValue = this.maxValue/this.tickSize;
        for(let i = 1; i < (this.maxValue/this.tickSize); i++) {
            this.allTickPoints.push((width / tickValue) * i )
        }
    }

    private mouseDownTrigger() {
        this.mouseDown = true;
    }
    private getElementOffset(elem) {
        var offsetLeft = 0;
        do {
            if (!isNaN(elem.offsetLeft)) {
                offsetLeft += elem.offsetLeft;
            }
        } while (elem = elem.offsetParent);
        return offsetLeft;
    }

    private changePosition($event) {
        if(this.mouseDown) {
            let value = ($event.clientX - this.getElementOffset(this.mainContainer))
            this.setDraggerPosition(value);
        }
    }

    private containerWidth() {
        let width = parseInt(window.getComputedStyle(this.mainContainer).width, 10);
        return width;
    }
    private setDraggerPosition(value) {
        if(value < 0) {
            value = 0;
        }
        var width = this.containerWidth();
        if((value + this.draggerWidth) > width) {
            value = width - this.draggerWidth;
        }
        this.onValueUpdated.emit({value: (this.maxValue/(width - this.draggerWidth)) * value})
        this.left = value + "px";
    }

    private getNextDraggerPosition() : number{
        for(var i = 0; i < this.allTickPoints.length; i++) {
            if((parseInt(this.left, 10) + 1) <= this.allTickPoints[i]) {
                return this.allTickPoints[i];
            }
        }
        return this.containerWidth();
    }

    private getPreviousDraggerPosition(): number {
        for(var i = this.allTickPoints.length - 1; i >=0; i--) {
            if((parseInt(this.left, 10) - 1) >= this.allTickPoints[i]) {
                return this.allTickPoints[i];
            }
        }
        return 0;
    }

    private mouseClickedOnTrack($event: MouseEvent): void {
        let value = ($event.clientX - this.getElementOffset(this.mainContainer))
        this.setDraggerPosition(value);
    }
    private createTicks() {
        var ticks = [];
        for(let i = 0; i < this.allTickPoints.length; i++) {
            ticks.push(<div class="ticks" style={{ left: this.allTickPoints[i] + "px" }}></div>)
        }
        return ticks;
    }

    private onKeyPress = (event: KeyboardEvent) => {
        switch(event.keyCode) {
            case this.Left_Arrow:
                if(event.ctrlKey || event.metaKey) {
                    this.setDraggerPosition(0);
                }else if(event.altKey){
                    this.setDraggerPosition(this.getPreviousDraggerPosition());
                }
                else {
                    this.setDraggerPosition(parseInt(this.left, 10) - 1);
                }
                break;
            case this.Right_Arrow:
                if(event.ctrlKey || event.metaKey) {
                    this.setDraggerPosition(this.containerWidth());
                }else if(event.altKey){
                    this.setDraggerPosition(this.getNextDraggerPosition());
                }else {
                    this.setDraggerPosition(parseInt(this.left, 10) + 1);
                }
                break;

        }
    }

    render() {
        return (
            <div class="main-container">
                {this.createTicks()}
                <div class="track" onClick={this.mouseClickedOnTrack.bind(this)}></div>
                <div class="dragger" style={{ left: this.left }} onMouseDown={this.mouseDownTrigger.bind(this)}></div>
            </div>

        )
    }

}