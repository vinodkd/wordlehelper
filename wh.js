function wordle_list(
    // green letter caps
    // yellow small where known positions exist
    // blank where unknown
    current_word_template,
     not_in_word
){
    [...current_word_template].forEach(l => {
        if(not_in_word.includes(l)){
            throw `${l} is in the "Not in word" list`;
        }
    });

    let allowed_letters = [];
    [..."ABCEDFGHIJKLMNOPQRSTUVWXYZ"].forEach(l => {
        if(! not_in_word.includes(l)){
            allowed_letters.push(l);
        }
    });

    let candidate_words = [];
    generate_suffixes(current_word_template,allowed_letters,0,candidate_words);
    return candidate_words;
}

function generate_suffixes(current_word_prefix,allowed_letters,index,candidate_words){
    // console.log("index:",index);
    if(index==5){
        candidate_words.push(current_word_prefix.join(''));
        return;
    }
    let l = current_word_prefix[index];
    // console.log("current letter:",l);
    if(l == " "){ // letter is unknown, generate candidates from allowed letters
        // console.log("blank position");
        let candidate_letters = [...allowed_letters];
        candidate_letters.map(cl => {
                let cwp = [...current_word_prefix];
                cwp[index] = cl;
                // console.log("generating suffixes for",cwp);
                generate_suffixes(cwp,allowed_letters,index+1,candidate_words);
        });
    } else if(l == l.toUpperCase()){ // letter in position known, just generate suffixes for remainder.
        // console.log("known letter:",l);
        generate_suffixes(current_word_prefix,allowed_letters,index+1,candidate_words);
    }else if(l == l.toLowerCase()){ //letter should be excluded from this position, generate candidates excluding l
        // console.log("excluded letter:",l);
        let candidate_letters = [...allowed_letters];
        candidate_letters.map(cl => {
            if(cl.toUpperCase() != l.toUpperCase()){
                let cwp = [...current_word_prefix];
                cwp[index] = cl;
                // console.log("generating suffixes for",cwp);
                generate_suffixes(cwp,allowed_letters,index+1,candidate_words);
            }
        });
    }
}

// console.log(wordle_list("hs  E","LAT"));
