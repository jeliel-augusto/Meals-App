import moment from 'moment'
export class Order {
    constructor(id, items, totalAmount, date) {
        this.id = id;
        this.items = items;
        this.totalAmount = totalAmount;
        this.date = date;
    }
    get readableDate(){

        return moment(this.date).format('Do MMMM YYYY')
    }
}
