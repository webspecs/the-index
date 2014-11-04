
(function () {
    if (!document.querySelector) return;
    
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
    
    // handle webspec definitions
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
    
}());
