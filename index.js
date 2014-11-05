
(function () {
    if (!document.querySelector) return;

    /*
        --- WebSpec Definitions ---
    */
    function dt (txt, dl) {
        var ret = document.createElement("dt");
        ret.textContent = txt;
        dl.appendChild(ret);
    }
    function na (dl) {
        var ret = document.createElement("dd");
        ret.className = "na";
        ret.textContent = "n/a";
        dl.appendChild(ret);
    }
    function simpleDD (repo, branch, dl) {
        var parts = repo.split("/", 2);
        var dd = document.createElement("dd")
        ,   a = document.createElement("a")
        ;
        a.href = "/" + parts[1] + "/" + parts[0] + "/" + branch;
        a.textContent = repo;
        dd.appendChild(a);
        dl.appendChild(dd);
    }
    
    var jsons = document.querySelectorAll("script[type='application/webspec+json']");
    for (var i = 0, n = jsons.length; i < n; i++) {
        var script = jsons[i]
        ,   ws = JSON.parse(script.textContent)
        ,   dl = document.createElement("dl")
        ;
        dl.className = "webspec";
        dt("master", dl);
        if (ws.master) simpleDD(ws.master, "master", dl);
        else na(dl);
        dt("develop", dl);
        if (ws.develop) simpleDD(ws.develop, "develop", dl);
        else na(dl);
        dt("proposals", dl);
        if (ws.proposals && ws.proposals.length) {
            var outerDD = document.createElement("dd")
            ,   innerDL = document.createElement("dl");
            for (var j = 0, m = ws.proposals.length; j < m; j++) {
                var prop = ws.proposals[j]
                ,   dt = document.createElement("dt")
                ,   dd = document.createElement("dd")
                ,   a = document.createElement("a")
                ,   parts = prop.repository.split("/", 2)
                ;
                a.href = "/" + parts[1] + "/" + parts[0] + "/" + prop.branch;
                a.textContent = prop.repository + "#" + prop.branch;
                dd.innerHTML = prop.description;
                dt.appendChild(a);
                innerDL.appendChild(dt);
                innerDL.appendChild(dd);
            }
            outerDD.appendChild(innerDL);
            dl.appendChild(outerDD);
        }
        else {
            na(dl);
        }
        script.parentNode.replaceChild(dl, script);
    }
    
    
    
    /*
        --- ToC ---
    */
    var sections = document.querySelectorAll("section")
    ,   toc = []
    ;
    // this is a super simplified variant
    // if h2 it goes into the top
    // otherwise it goes into the previous one
    for (var i = 0, n = sections.length; i < n; i++) {
        var section = sections[i]
        ,   topLevel = !!section.querySelector("h2")
        ,   h = section.querySelector(topLevel ? "h2" : "h3")
        ,   id = h.id
        ,   cnt = h.innerHTML
        ,   secno = topLevel ? toc.length + 1 : (toc.length) + "." + (toc[toc.length - 1].children.length + 1)
        ;
        if (h.classList.contains("no-ref")) continue;
        if (topLevel) {
            toc.push({
                content:    cnt
            ,   id:         id
            ,   secno:      secno
            ,   children:   []
            ,   noNum:      h.classList.contains("no-num")
            });
        }
        else {
            toc[toc.length - 1].children.push({
                content:    cnt
            ,   id:         id
            ,   secno:      secno
            ,   noNum:      h.classList.contains("no-num")
            });
        }
        h.classList.add("heading", "settled");
        h.textContent = null;
        if (!h.classList.contains("no-num")) {
            var span = document.createElement("span");
            span.className = "secno";
            span.textContent = secno + ". ";
            h.appendChild(span);
        }
        var span = document.createElement("span");
        span.className = "content";
        span.innerHTML = cnt;
        h.appendChild(span);
        if (!h.classList.contains("no-ref")) {
            var a = document.createElement("a");
            a.className = "self-link";
            a.href = "#" + id;
            h.appendChild(a);
        }
    }
    function tocline (details, parent) {
        var li = document.createElement("li")
        ,   a = document.createElement("a")
        ;
        a.href = "#" + details.id;
        li.appendChild(a);
        if (!details.noNum) {
            var span = document.createElement("span");
            span.className = "secno";
            span.textContent = details.secno;
            a.appendChild(span);
            a.appendChild(document.createTextNode(" "));
        }
        var span = document.createElement("span");
        span.className = "content";
        span.innerHTML = details.content;
        a.appendChild(span);
        parent.appendChild(li);
        return li;
    }
    var tocUL = document.getElementById("toc");
    for (var i = 0, n = toc.length; i < n; i++) {
        var topSec = toc[i]
        ,   li = tocline(topSec, tocUL);
        if (topSec.children && topSec.children.length) {
            var ul = document.createElement("ul");
            ul.className = "toc";
            for (var j = 0, m = topSec.children.length; j < m; j++) {
                var kid = topSec.children[j];
                tocline(kid, ul);
            }
            li.appendChild(ul);
        }
    }
}());
