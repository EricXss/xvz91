function urlTo(relativeUrl) {
	return document.body.getAttribute("data-root") + relativeUrl;
};

Storage.prototype.setObject = function(key, value) {
	this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
	var value = this.getItem(key);
	return value && JSON.parse(value) || [];
}

var links = localStorage.getObject("links");
for (var link of links) {
	if (link.title != undefined && link.href != undefined) {
		$("<a target='_blank' class='track'></a>").attr("href", link.href).html(link.title).appendTo($("#stats"));
	}
}

$(".track").click(function() {
	var id = $(this).data("id");
	var href = $(this).attr("href");
	//$.get("node/hits", { id : id });
	var newLink = {
		title: $(this).attr("title"),
		href: href,
		hits: 0
	};
	for (var i = links.length - 1; i >= 0; i--) {
		if (links[i].href === newLink.href) {
			links.splice(i, 1);
		}
	}
	links.unshift(newLink);
	links = links.slice(0, 20);
	localStorage.setObject("links", links);

	var key = "node" + id;
	var counter = parseInt(localStorage.getItem(key) || 0);
	localStorage.setItem(key, counter + 1);

	ga('send', {
		hitType: 'event',
		eventCategory: 'Link',
		eventAction: 'Click',
		eventLabel: (new URL(href)).hostname
	});
	ga('send', {
		hitType: 'event',
		eventCategory: 'Category',
		eventAction: 'Click',
		eventLabel: $(this).data("category_title")
	});
});
var lists = document.querySelectorAll('.sortable');

lists.forEach(function(list) {
	[...list.children].sort(function(a, b) {
		var aweb = $(".track", a);
		var bweb = $(".track", b);
		var akey = "node" + aweb.data("id");
		var acounter = parseInt(localStorage.getItem(akey) || 0) / 10 + parseInt(aweb.data("counter"));
		var bkey = "node" + bweb.data("id");
		var bcounter = parseInt(localStorage.getItem(bkey) || 0) / 10 + parseInt(bweb.data("counter"));
		return Math.floor(acounter) > Math.floor(bcounter) ? -1 : 1;
	})
		.forEach(node => list.appendChild(node));
});
