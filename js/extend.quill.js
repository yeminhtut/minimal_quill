Quill.register('modules/custom_attach', function(quill, options) {
    var toolbar = quill.getModule('toolbar');
    toolbar.addHandler('emoji', showEmojiPalatte);

    function showEmojiPalatte() {
        emoji_palatte_container = document.createElement('div');
        quill.container.parentNode.insertBefore(emoji_palatte_container, quill.container);
        emoji_palatte_container.classList.add('emoji-palette');
        
        var emojiCollection = [
			{name: 'laugh', icon: '😀'}, 
			{name: 'smile', icon: '🙂'}, 
			{name: 'cry', icon: '😭'}
        ];

        showEmojiList(emojiCollection);

        emojiCollection.map(function(emoji) {
            //emojiHandler(emoji.name, emoji.icon);
        });

        function showEmojiList(emojiCollection){
            let lastRange = quill.getSelection();
            console.log(lastRange);
        	emojiCollection.map(function(emoji) {
	            let span = document.createElement('span');
	            span.classList.add('bem');
	        	span.classList.add('bem-'+emoji.name);
	        	emoji_palatte_container.appendChild(span);
                
	        	var customButton = document.querySelector('.bem-' + emoji.name);
		        if (customButton) {
		               customButton.addEventListener('click', function() {
		                   var range = lastRange;
		                   if (range) {
		                       quill.insertText(range.index, emoji.icon);
		                   }
		               });
		           };
	        });
        }
    }
});

Quill.register('modules/typing', function(quill, options) {
    quill.on('text-change', function(delta, oldDelta, source) {
        if (source == 'user') {
            setTimeout(function() {
                document.getElementById("typing").innerHTML = "Typing...";
            }, 0);
            setTimeout(function() {
                document.getElementById("typing").innerHTML = "";
            }, 100);
        }
    });
});

Quill.register('modules/extend_toolbar', function(quill, options) {
    var container;
    if (Array.isArray(options.container)) {
        container = document.createElement('div');
        addControls(container, options.container);
        quill.container.parentNode.insertBefore(container, quill.container);
        container = container;
    } else if (typeof options.container === 'string') {
        container = document.querySelector(options.container);
    } else {
        container = options.container;
    }

    container.classList.add('custom-ql-toolbar');

    //Add controls
    function addControls(container, groups) {
        if (!Array.isArray(groups[0])) {
            groups = [groups];
        }
        groups.forEach(function(controls) {
            let group = document.createElement('span');
            group.classList.add('ql-formats');
            controls.forEach(function(control) {
                if (typeof control === 'string') {
                    addButton(group, control);
                } else {
                    let format = Object.keys(control)[0];
                    let value = control[format];
                    if (Array.isArray(value)) {
                        addSelect(group, format, value);
                    } else {
                        addButton(group, format, value);
                    }
                }
            });
            container.appendChild(group);
        });
    }

    //end of add controls function
    function addButton(container, format, value) {
        let input = document.createElement('button');
        input.setAttribute('type', 'button');
        input.classList.add('ql-' + format);
        if (value != null) {
            input.value = value;
        }
        container.appendChild(input);
    }

    function addSelect(container, format, values) {
        let input = document.createElement('select');
        input.classList.add('ql-' + format);
        values.forEach(function(value) {
            let option = document.createElement('option');
            if (value !== false) {
                option.setAttribute('value', value);
            } else {
                option.setAttribute('selected', 'selected');
            }
            input.appendChild(option);
        });
        container.appendChild(input);
    }

});