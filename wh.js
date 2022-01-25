function wordle_list(
    // green: write the letter in caps
    // yellow: write the letter in small. if there are multiple yellow letters for a position, enclose in braces.
    // space, - or _ where unknown
    current_word_template,
     not_in_word
){
    let current_word_prefix = [];
    let in_list = false;
    let pos_list = "";
    [...current_word_template].forEach(l => {   //loop through the input
        switch (l) {
            case "(":   // if its an open brace, that's the list of yellow words for this position
                if(in_list) {throw `Cannot nest lists`;}
                in_list = true;
                pos_list = "";  // so create an array to hold them
                break;
            case ")":   // if its a close brace, that's the list ending.
                if(!in_list) { throw `Closing brace without opening brace`;}
                current_word_prefix.push(pos_list); // s push all the letters collected so far
                in_list = false;
                break;
            case " ":   // if its a space, hyphen or underscore, replace with blank
            case "-":
            case "_":
                current_word_prefix.push(" ");
                break;
            default:    // if its not any of the above, check that its a letter and add it appropriately
                if("abcdefghijklmnopqrstuvwxyz".includes(l.toLowerCase())){
                    if(in_list){    // if we're in a list, add it to the list
                        pos_list+=l;
                    }else{          // otherwise, add it directly to the prefix
                        current_word_prefix.push(l);
                    }
                }else throw `${l} is not a letter`;
                break;
        }
        if(not_in_word.includes(l)){
            throw `${l} is in the "Not in word" list`;
        }
    });

    let allowed_letters = [];
    not_in_word = not_in_word.toUpperCase();
    [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].forEach(l => {
        if(! not_in_word.includes(l)){
            allowed_letters.push(l);
        }
    });

    let candidate_words = [];
    generate_suffixes(current_word_prefix,allowed_letters,0,candidate_words);
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
    }else if(l == l.toLowerCase() || l.length >1){ //letter(s) should be excluded from this position, generate candidates excluding l
        // console.log("excluded letter:",l);
        let candidate_letters = [...allowed_letters];
        candidate_letters.map(cl => {
            // l in this case is a string of letters not allowed in this position.
            // so if cl is included in it, dont generate suffixes with cl
            if(!l.toUpperCase().includes(cl)){
                let cwp = [...current_word_prefix];
                cwp[index] = cl;
                // console.log("generating suffixes for",cwp);
                generate_suffixes(cwp,allowed_letters,index+1,candidate_words);
            }
        });
    }
}

// console.log(wordle_list("hs  E","LAT"));
