import { Component, State, Element, Prop, EventEmitter, Event } from '@stencil/core'
@Component({
    tag: "slider-element",
    styleUrl: "slider.css",
})

export class Slider {
    @Prop() maxValue: number = 255;
    @Prop() tickSize: number = 50;
    @State() left: string;
    @State() allTickPoints: number[] = [];
    @State() totalTicks: number =0;

    @Element() sliderElement: HTMLElement;
    @Event() onValueUpdated: EventEmitter;

    private mouseDown: boolean;
    private mainContainer: HTMLElement;
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
            if(value < 0) {
                value = 0;
            }
            let width = parseInt(window.getComputedStyle(this.mainContainer).width, 10);
            let dragger = this.sliderElement.querySelector('.dragger');
            let draggerWidth = parseInt(window.getComputedStyle(dragger).width, 10);
            if((value + draggerWidth) > width) {
                value = width - draggerWidth;
            }
            this.onValueUpdated.emit({value: (this.maxValue/(width - draggerWidth)) * value})
            this.left = value + "px";
        }
    }

    private createTicks() {
        var ticks = [];
        for(let i = 0; i < this.allTickPoints.length; i++) {
            ticks.push(<div style={{ width: "1px", height: "100%", "background-color": "blue", position: "absolute", left: this.allTickPoints[i] + "px" }}></div>)
        }
        return ticks;
    }

    render() {
        return (
            <div class="main-container" style={{ height: "40px", display: "flex", flex: "1 1 auto", "background-color": "gray", "align-items": "center", position: "relative" }}>
                {this.createTicks()}
                <div style={{ "background-color": "darkgray", width: "100%", height: "10px" }}></div>
                <div class="dragger" style={{ width: "5px", "background-color": "brown", height: "100%", position: "absolute", left: this.left }} onMouseDown={this.mouseDownTrigger.bind(this)}></div>
            </div>

        )
    }

}