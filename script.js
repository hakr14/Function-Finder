class Point{
    constructor(x, y){
        this.x = new math.Fraction(x);
        this.y = new math.Fraction(y);
    }
}
Point.prototype.toString = function(){
    return "(" + this.x + ", " + this.y + ")";
};

function polynomial(points){
    let a = [];
    let b = [];
    for(const p of points){
        let s = [];
        for(let i = points.length - 1; i >= 0; i--)
            s.push(math.pow(p.x, i));
        a.push(s);
        b.push([p.y]);
    }
    let s = math.flatten(math.multiply(math.inv(a), b));
    let d = s.length-1;
    let r = "";
    for(const c of s){
        if(math.unequal(c,0)){
            if(math.unequal(c,1)){
                r += "+";
                r += "(" + math.format(c, {format: "ratio"}) + ")";
            }else if(d==0)
                r += "+1";
            if(d!=0){
                r += "x";
                if(d!=1)
                    r += "^" + d;
            }
        }
        d--;
    }
    return r;
}

var points = 0;

function add(){
    let form = document.getElementById('points');
    let r = document.getElementById('remove');
    points++;
    let x = document.createElement("input");
    x.className = "p x " + points.toString();
    x.size = "4";
    x.setAttribute("onchange", "graph();");
    let y = document.createElement("input");
    y.className = "p y " + points.toString();
    y.size = "4";
    y.setAttribute("onchange", "graph();");
    let c = document.createElement("span");
    c.innerHTML = ", ";
    let s = document.createElement("span");
    s.className = "point " + points.toString();
    s.appendChild(x);
    s.appendChild(c);
    s.appendChild(y);
    s.appendChild(document.createElement("br"));
    form.insertBefore(s, r);
    check();
}

function remove(){
    let form = document.getElementById('points');
    if(points>1){
        let s = document.getElementsByClassName("point " + points.toString())[0];
        form.removeChild(s);
        points--;
    }
    check();
}

function graph(){
    let types = document.getElementsByName("type");
    let t = "polynomial";
    for(let i = 0; i < types.length; i++){
        console.log(i);
        console.log(types[i].value);
        if(types[i].checked){
            t = types[i].value;
            break;
        }
    }
    let func = window[t](getPoints());
    document.getElementById("func").innerHTML = func;
    functionPlot({
        target: "#graph",
        data: [{
            fn: func,
            sampler: "builtIn",
            graphType: "polyline"
        }]
    });
}

function getPoints(){
    let pl = document.getElementsByClassName("point");
    let l = []
    for(let s of pl){
        let x = s.getElementsByClassName("x")[0].value;
        if(x==="")
            x = "0";
        let y = s.getElementsByClassName("y")[0].value;
        if(y==="")
            y = "0";
        l.push(new Point(x, y));
    }
    return l;
}

// NO NEGATIVE X
function logarithmic(points){
    let p1 = points[0];
    let p2 = points[1];
    let a = (p1.y - p2.y) / (math.log(math.bignumber(p1.x)) - math.log(math.bignumber(p2.x)));
    let b = math.exp((p2.y*math.log(math.bignumber(p1.x))-p1.y*math.log(math.bignumber(p2.x)))/(p1.y-p2.y));
    return a.toString() + "*log(" + b.toString() + "*x)";
}

// Y1 and Y2 MUST have same sign
function exponential(points){
    let p1 = points[0];
    let p2 = points[1];
    let b = math.nthRoot(math.bignumber(p1.y)/math.bignumber(p2.y), math.bignumber(p1.x)-math.bignumber(p2.x));
    let a = math.bignumber(p1.y)/math.pow(math.bignumber(b),math.bignumber(p1.x));
    return a.toString() + "*" + b.toString() + "^x";
}

var prev = "intentionallynonexistantid";

function check(){
    let types = document.getElementById("types");
    while(types.firstChild){
        types.removeChild(types.firstChild);
    }
    if(points>0){
        let t = document.createElement("input");
        t.setAttribute("type", "radio");
        t.setAttribute("id", "polynomial");
        t.setAttribute("name", "type");
        t.setAttribute("value", "polynomial"); 
        t.setAttribute("onchange", "graph();");
        let l = document.createElement("label");
        l.setAttribute("for", "polynomial");
        l.innerHTML = "Polynomial";
        types.appendChild(t);
        types.appendChild(l);
    }
    if(points==2){
        let t = document.createElement("input");
        t.setAttribute("type", "radio");
        t.setAttribute("id", "exponential");
        t.setAttribute("name", "type");
        t.setAttribute("value", "exponential");
        t.setAttribute("onchange", "graph();");
        let l = document.createElement("label");
        l.setAttribute("for", "exponential");
        l.innerHTML = "Exponential";
        types.appendChild(t);
        types.appendChild(l);
        
        t = document.createElement("input");
        t.setAttribute("type", "radio");
        t.setAttribute("id", "logarithmic");
        t.setAttribute("name", "type");
        t.setAttribute("value", "logarithmic");
        t.setAttribute("onchange", "graph();");
        l = document.createElement("label");
        l.setAttribute("for", "logarithmic");
        l.innerHTML = "Logarithmic";
        types.appendChild(t);
        types.appendChild(l);
    }
    //TODO: more types
    let s = document.getElementById(prev);
    if(s==null){
        s = document.getElementById("polynomial");
    }
    s.checked = true;
    prev = s.value;
}