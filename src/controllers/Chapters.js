import React from 'react';
import { Text, View, TouchableHighlight, Image, ScrollView, Dimensions } from 'react-native';
import Styles from './../styles/Styles';
import { Ionicons } from '@expo/vector-icons';
const chaptersInfo = require("../assets/content/chapters.json");
const chapterTitles = require("../assets/content/chaptertitles.json")
var chapters = [];
function CreateChapters() {
    console.log("Create chapters!");
    chapterTitles.forEach((title, chapterIndex) => {
        console.log(title);
        if(chaptersInfo[title]) {
            var chapter = chaptersInfo[title];
            chapter.key = ""+(chapterIndex+1);
            if(chapter.subchapters) {
                chapter.subchapters.forEach((subchapter, subIndex) => {
                    subchapter.key = chapter.key+"."+(subIndex+1);
                });
            }
            chapters.push(chapter);
        }
        else {
            console.error("Missing chapter " + title + "!!!");
        }
    });
    console.log("Chapters length", chapters.length);
}

function GetChapters() {
    if (chapters.length === 0)
        CreateChapters();
    return chapters;    
}

function KeyForName(name, subName) {
    var foundKey;
    chapters.forEach(chapter => {
        if(name === chapter.name) {
            foundKey = chapter.key;
            chapter.subchapters.forEach(subchapter => {
                if(subName === subchapter.name) {
                    foundKey = subchapter.key;
                    return;
                }
            });
            return;
        }
    });
    return foundKey;
}

function GetText(textItem, key, array, italic) {
    var style = italic ? Styles.pItalic : Styles.p;
    if(typeof textItem === "string") {
        array.push(<Text style={style} key={key}>{textItem}</Text>);
    } else {
        textItem.forEach(function(item, index) {
            array.push(<Text style={style} key={key+index}>{item}</Text>)
        });
    }
    return array;
}

function ElementToView(element, key) {
    if(element.type == "list") {
        var items = [];
        if (element.content.header) 
            items.push(<Text key={key+"header"} style={Styles.pBold}>{element.content.header}</Text>);
        
        element.content.items.forEach(function(item, index) {
            GetText(item, key+index, items);
        });
        return <View key={key} style={Styles.elementcontainer}>
            {items}
        </View>
    }
    else if(element.type == "text") {
        return <View key={key} style={Styles.elementcontainer}>
            {GetText(element.content,key,[])}
        </View>
    }
    else if(element.type == "italics") {
        return <View key={key} style={Styles.elementcontainer}>
            {GetText(element.content,key,[],true)}
        </View>
    }
    else if(element.type == "image") {
        return <View key={key}>
            <Text style={Styles.pA}>{element.image.content}</Text>
        </View>
    }
    else if(element.type == "numberList") {
        var items = [];
        if (element.content.header) 
            items.push(<Text key={key+"header"} style={Styles.pBold}>{element.content.header}</Text>);
        
        element.content.items.forEach(function(item, index) {
            if(typeof item === "string") {
                item = (index+1)+". " + item;
            } else {
                item[0] = (index+1)+". " + item[0];
            }
            GetText(item, key+index, items);
        });
        return <View key={key} style={Styles.elementcontainer}>
            {items}
        </View>

    }
    else {
        return <View key={key} style={Styles.elementcontainer}><Text>{element.type}</Text></View>
    }
}

function GetViewBlocks(elements, title) {
    var blocks = [];
    if (elements) {
        elements.forEach((element, index) => {
            blocks.push(ElementToView(element, title+index));
        });
    }
    return blocks;
}

async function ChapterElementsToViews(chapter, parent) {
    var blocks = GetViewBlocks(chapter.elements, chapter.name);
    if (chapter.subchapters) {
        chapter.subchapters.forEach(subchapter => {
            var subchapterBlocks = GetViewBlocks(subchapter.elements, chapter.name+subchapter.name);
            blocks.push(
            <View style={{ marginBottom: 10 }} key={subchapter.key} onLayout={(event) => {
                var { x, y, width, height } = event.nativeEvent.layout;
                parent.onViewLayout(subchapter.key, y);
              }}>
              <View style={Styles.subchaptercontainer}>
                    <Text style={Styles.h2}>{subchapter.name}</Text>
                  </View>
      
              <View style={Styles.pcontainer}>
                {subchapterBlocks}
              </View>
            </View>);
          });
    }
    return blocks;
}

export {
    GetChapters,
    ChapterElementsToViews,
    KeyForName
};