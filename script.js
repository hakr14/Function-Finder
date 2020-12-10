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
    let m = "";
    let r = "";
    for(const c of s){
        if(math.unequal(c,0)){
            if(math.unequal(c,1)){
                r += "+";
                r += "(" + math.format(c, {format: "ratio"}) + ")";
                if(math.smaller(c, 0)){
                    m += "-";
                }else{
                    if(d!=s.length-1)
                        m += "+";
                }
                if(c.d!=1)
                    m += "\\frac{" + math.abs(c.n) + "}{" + math.abs(c.d) + "}";
                else
                    m += math.abs(c.n);
            }else if(d==0){
                r += "+1";
                m += "+1";
            }
            if(d!=0){
                r += "x";
                m += "x";
                if(d!=1){
                    r += "^" + d;
                    m += "^{" + d + "}";
                }
            }
        }
        d--;
    }
    return [m, r];
}

var points = 0;

function add(){
    let form = document.getElementById('points');
    let a = document.getElementById('plus');
    points++;
    let x = document.createElement("input");
    x.className = "p x";
    x.size = "4";
    x.setAttribute("onchange", "check();graph();");
    x.setAttribute("value", points);
    let y = document.createElement("input");
    y.className = "p y";
    y.size = "4";
    y.setAttribute("onchange", "check();graph();");
    y.setAttribute("value", points);
    let c = document.createElement("span");
    c.innerHTML = ", ";
    let r = document.createElement("button");
    r.className = "values remove";
    r.setAttribute("type", "button");
    r.setAttribute("onclick", "document.getElementById('points').removeChild(this.parentElement);points--;check();graph();");
    r.innerHTML = "<b>-</b>";
    let s = document.createElement("span");
    s.className = "point";
    s.appendChild(x);
    s.appendChild(c);
    s.appendChild(y);
    s.appendChild(r);
    s.appendChild(document.createElement("br"));
    form.insertBefore(s, a);
    check();
}

function graph(){
    let types = document.getElementsByName("type");
    let t = "polynomial";
    for(let i = 0; i < types.length; i++){
        if(types[i].checked){
            t = types[i].value;
            break;
        }
    }
    let points = getPoints();
    let l = [];
    for(let p of points)
        l.push([math.number(p.x), math.number(p.y)]);
    let func = window[t](points);
    document.getElementById("func").innerHTML = "$$" + func[0] + "$$";
    functionPlot({
        target: "#graph",
        data: [{
            fn: func[1],
            sampler: "builtIn",
            graphType: "polyline"
        },
        { 
            points: l,
            fnType: "points",
            graphType: "scatter"
        }]
    });
    MathJax.typeset();
}

function getPoints(){
    let pl = document.getElementsByClassName("point");
    let l = [];
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

function logarithmic(points){
    let p1 = points[0];
    let p2 = points[1];
    let a1 = math.subtract(p1.y, p2.y);
    let a2 = math.divide(p1.x, p2.x);
    let a = math.divide(math.bignumber(a1), math.log(math.bignumber(a2)));
    let bd = math.subtract(p1.y, p2.y);
    let b = math.exp((p2.y*math.log(math.bignumber(p1.x))-p1.y*math.log(math.bignumber(p2.x)))/bd);
    let r = a.toString() + "*log(" + b.toString() + "*x)";
    let m = "\\frac{" + a1.n + "}{"
    if(a1.d!=1)
        m += a1.d;
    if(a1.s==-1)
        a2 = math.inv(a2);
    m += "\\ln\\left(";
    if(a2.d!=1)
        m += "\\frac{" + a2.n + "}{" + a2.d + "}";
    else
        m += a2.n;
    m += "\\right)}";
    let bs;
    if(math.isInteger(b))
        bs = b.toString();
    else{
        bs = "e^{";
        let x, y, z, w;
        if(p1.x.s==-1)
            x = "-";
        else
            x = "";
        if(math.isInteger(p1.x))
            x += p1.x.n.toString();
        else
            x += "\\frac{" + p1.x.n + "}{" + p1.x.d + "}";
        if(math.isInteger(p1.y))
            y = p1.y.n.toString();
        else
            y = "\\frac{" + p1.y.n + "}{" + p1.y.d + "}";
        if(p2.x.s==-1)
            z = "-";
        else
            z = "";
        if(math.isInteger(p2.x))
            z += p2.x.n.toString();
        else
            z += "\\frac{" + p2.x.n + "}{" + p2.x.d + "}";
        if(p2.y.s==-1)
            w = "-";
        else
            w = "";
        if(math.isInteger(p2.y))
            w += p2.y.n.toString();
        else
            w += "\\frac{" + p2.y.n + "}{" + p2.y.d + "}";
        let bn = w + "\\ln\\left(" + x + "\\right)";
        if(p1.y.s==-1)
            bn += "+";
        else
            bn += "-";
        bn += y + "\\ln\\left(" + z + "\\right)"
        if(bd.s==-1){
            bs += "-";
            bd = math.abs(bd);
        }
        if(math.equal(bd, 1))
            bs += bn;
        else
            bs += "\\frac{" + bn + "}{" + math.abs(bd) + "}";
        bs += "}";
    }
    m += "\\ln\\left(" + bs + "x\\right)";
    return [m, r];
}

function exponential(points){
    let p1 = points[0];
    let p2 = points[1];
    let b = math.nthRoot(math.bignumber(p1.y)/math.bignumber(p2.y), math.bignumber(p1.x)-math.bignumber(p2.x));
    let a = math.bignumber(p1.y)/math.pow(math.bignumber(b),math.bignumber(p1.x));
    let r = a.toString() + "*" + b.toString() + "^x";
    return [r, r];
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
        let p = getPoints();
        let p1 = p[0];
        let p2 = p[1];
        
        if(math.equal(math.sign(p1.y), math.sign(p2.y))&&!math.equal(p1.y,0)&&!math.equal(p2.y,0)){
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
        }
        
        if(math.equal(math.add(math.compare(p1.x,0), math.compare(p2.x,0)), 2)){
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
        
        for(let r of document.getElementsByClassName("remove")){
            r.disabled = true;
            r.style.visibility = "hidden";
        }
    }else{
        for(let r of document.getElementsByClassName("remove")){
            r.disabled = false;
            r.style.visibility = "visible";
        }
        //TODO: more types
    }
    let s = document.getElementById(prev);
    if(s==null){
        s = document.getElementById("polynomial");
    }
    s.checked = true;
    prev = s.value;
}