Quill.register('modules/custom_attach', function(quill, options) {
    var toolbar = quill.getModule('toolbar');
    toolbar.addHandler('emoji', checkPalatteExist);

    function checkPalatteExist(){
        var elementExists = document.getElementById("emoji-palette");
        if (elementExists) {
            return elementExists.remove();
        }
        let range = quill.getSelection();
        showEmojiPalatte(range);
    }

    function showEmojiPalatte() {
        var bodyRect = document.body.getBoundingClientRect();
        toolbar_emoji_element = document.querySelector('.ql-emoji');
        rect = toolbar_emoji_element.getBoundingClientRect();
        
        let range = quill.getSelection();
        emoji_palatte_container = document.createElement('div');
        toolbar_container = document.querySelector('.ql-toolbar');
        toolbar_container.appendChild(emoji_palatte_container);
        emoji_palatte_container.id = 'emoji-palette'; 
        emoji_palatte_container.style.right= rect.right - 100;

        emojiCollection = emojiOne;
        showEmojiList(emojiCollection);

        function showEmojiList(emojiCollection){
        	emojiCollection.map(function(emoji) {
                let span = document.createElement('span');
                let t = document.createTextNode(emoji.shortname);
                span.appendChild(t);
                span.classList.add('bem');
                span.classList.add('bem-'+emoji.name);
                let output = convert(emoji.shortname);
                span.innerHTML = output+' ';
                emoji_palatte_container.appendChild(span);
                
	        	var customButton = document.querySelector('.bem-' + emoji.name);
		        if (customButton) {
	                customButton.addEventListener('click', function() {
                        if (range) {
                           quill.insertText(range.index, customButton.innerHTML);
                           console.log(range);
                           quill.setSelection(range.index+4, 0);
                           range.index = range.index+4;
                           console.log('current cursor point is');
                           console.log(quill.getSelection());
                           checkPalatteExist();
                        }
	                });
		        };
	        });
        }

        // quill.once('text-change', function(delta, oldDelta, source) {
        //    if (source == 'api') {
        //         console.log("An API call triggered this change.");
        //         console.log(delta);
        //         console.log(quill.getSelection());
        //    } else if (source == 'user') {
        //         console.log("A user action triggered this change.");
        //         console.log(quill.getSelection());
        //    }
        // });   
    }

    function closeEmojiPalatte() {
        
    }

    function convert(input){
            var emoji = new EmojiConvertor();

            // replaces \u{1F604} with platform appropriate content
            var output1 = emoji.replace_unified(input);

            // replaces :smile: with platform appropriate content
            var output2 = emoji.replace_colons(input);

            // force text output mode
            emoji.text_mode = true;

            // show the short-name as a `title` attribute for css/img emoji
            emoji.include_title = true;

            // change the path to your emoji images (requires trailing slash)
            // you can grab the images from the emoji-data link here:
            // https://github.com/iamcal/js-emoji/tree/master/build
            emoji.img_sets.apple.path = 'http://my-cdn.com/emoji-apple-64/';
            emoji.img_sets.apple.sheet = 'http://my-cdn.com/emoji-apple-sheet-64.png';

            // Configure this library to use the sheets defined in `img_sets` (see above)
            emoji.use_sheet = true;

            // add some aliases of your own - you can override builtins too
            emoji.addAliases({
              'doge' : '1f415',
              'cat'  : '1f346'
            });

            // remove your custom aliases - this will reset builtins
            emoji.removeAliases([
              'doge',
              'cat',
            ]);

            return output2;

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