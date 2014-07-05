input_maps = (function () {

    var result = {};

    function create_dictionary_and_keymap(group) {
        var dictionary = {};
        var keymap = {};

        var defaults = default_keybinds[group];

        _.forIn(action_sets[group], function (fn, key) {

            var wrapping_fn = function () {
                fn.apply(this, arguments)
                var audio_response = _.isUndefined(input_audio_response_overrides[key]) ? '/SE/UI/UI_Click' : input_audio_response_overrides[key];
                if (audio_response)
                    api.audio.playSound(audio_response);
            };

            var binding = defaults[key];
            var alt;
            var use_alt = false;

            if (localStorage['keybinding_' + key] !== undefined)
                binding = decode(localStorage['keybinding_' + key]);

            if (binding && binding.length === 1) {
                alt = binding;
                alt = [alt.toLowerCase(), alt.toUpperCase()];

                if (alt[0] !== alt[1])
                    use_alt = true;
            }

            if (use_alt) {
                dictionary[alt[0]] = wrapping_fn;
                dictionary[alt[1]] = wrapping_fn;
            }
            else
                dictionary[binding] = wrapping_fn;

            keymap[binding] = key;
        });

        return {
            dictionary: dictionary,
            keymap: keymap
        };
    }

    _.forIn(action_sets, function (set, group) {
        result[group] = create_dictionary_and_keymap(group);
    });

    return result;
})();
