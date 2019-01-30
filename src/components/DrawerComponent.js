import React from 'react'
import { StyleSheet, Text, View, Image, ScrollView, FlatList, TouchableOpacity, ImageBackground, Icon } from 'react-native'
import { NavigationActions } from 'react-navigation'
import ChapterListItem from './ChapterListItem'
import styles from '../styles/Styles'
import Chapters from "../assets/testContent/chapters.js";
import { GetCurrentRouteParams } from '../controllers/NavigationHelper.js';

export default class DrawerComponent extends React.Component {

  render() {
    const { navigation } = this.props;
    const params = GetCurrentRouteParams(navigation.state);
    var drawerContent;
    if (params) {
      if (params.drawerContent === "chapters") {
        drawerContent =
       <FlatList 
            data={Chapters}
            renderItem={({ item }) => 
            <ChapterListItem style={styles.chapterlist} chapter={item} level={0} currentChapter={params.currentChapter} />}
            extraData={currentChapter = params.currentChapter}
          />
      }
     
    }


    return (
      this.props.screenProps.fontLoaded ? (
    <View style={styles.drawer}>

      <View style={styles.drawerLogo}>
        <Image resizeMode='contain' style={styles.drawerImage} source={require('../assets/images/logo.png')}/>
        <View style={{flexDirection: "column"}}>
        <Text style={styles.ljosmaedrafelagInfo}>Ljósmæðrafélag</Text>
        <Text style={styles.ljosmaedrafelagInfo}>Íslands</Text>
        </View>
      </View>

      <ScrollView style={styles.drawerChapters}>   
        {drawerContent}
      </ScrollView>
        
      <View style={styles.drawerButtons} > 
        <TouchableOpacity  onPress={() => navigation.navigate('NewsFeed', { drawerContent: "news" })}>
          <Text style={styles.drawerItem}> Fréttaveita </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Information', { drawerContent: "information" })}>
         <Text style={styles.drawerItem}> Upplýsingar </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Search', { drawerContent: "chapters" })}>
         <Text style={styles.drawerItem}> Handbók  </Text>
        </TouchableOpacity>

      </View>
    </View>

)
: null

    )
  }
}


