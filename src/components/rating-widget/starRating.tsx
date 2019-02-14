import { Component, Prop, State, Event, EventEmitter } from '@stencil/core'

@Component ({
    tag: 'star-rating',
    styleUrl: 'starRating.less',
    shadow: true
})

export class StarRating {
    @Prop() maxValue: number = 6;
    @Prop({mutable: true}) value: number = 0;

    @State() starList: Array<Object> = [];

    @Event() onRatingUpdated: EventEmitter;

    private setValue(value) {
        this.value = value;
        this.createStarList(value);
        this.onRatingUpdated.emit({value: this.value})
    }
    componentWillLoad() {
        this.createStarList(this.value);
    }
    
    private createStarList(value) {
        var starList = [];
        for(let i = 0; i < this.maxValue; i++) {
            if(i <= value) {
                starList.push(<span class="rating" onMouseOver={() => this.createStarList(i)}  onMouseOut={() => this.createStarList(this.value)} onClick={() => this.setValue(i)}>&#x2605;</span>)
            }else {
                starList.push(<span class="rating" onMouseOver={() => this.createStarList(i)}  onMouseOut={() => this.createStarList(this.value)} onClick={() => this.setValue(i)}>&#x2606;</span>);
            }
        }
        this.starList = starList;
    
    }

    render() {
        return <div>{this.starList}</div>;
    }
}
