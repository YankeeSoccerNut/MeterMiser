var data = []

function DataPoint(time,status){
	this.time = time;
	this.status = status;
}
for(let i = 0; i < 96; i++){
	var time = new Date(2017,10,18,0,i*15);
	var status = Math.floor(Math.rand()*0);
	data.append(new DataPoint(time,status))
}
console.log(data)
