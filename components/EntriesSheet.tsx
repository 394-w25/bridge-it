import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,

} from 'react-native';
import { Sheet } from 'tamagui';
import AllEntriesModal from '../app/screens/allEntry';
import { JournalEntry } from '../types/journal';
const { width, height } = Dimensions.get('window');

interface EntriesSheetProps {
  visible: boolean;
  onClose: () => void;
}

const EntriesSheet: React.FC<EntriesSheetProps> = ({ visible, onClose }) => {

  const [modal, setModal] = useState(true);
  const [open, setOpen] = useState(visible);
  const [position, setPosition] = useState(0);
  
  useEffect(() => {
    setOpen(visible);
  }, [visible]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      onClose();
    }
  };

//   // Animation for the sheet
//   const translateY = useRef(new Animated.Value(height)).current;
  
//   useEffect(() => {
//     if (visible) {
//       Animated.spring(translateY, {
//         toValue: 0,
//         useNativeDriver: true,
//         tension: 65,
//         friction: 11
//       }).start();
//     } else {
//       Animated.spring(translateY, {
//         toValue: height,
//         useNativeDriver: true,
//         tension: 65,
//         friction: 11
//       }).start();
//     }
//   }
//   , [visible, translateY]);


//   if (!visible) return null;

  return (
    <Sheet
        modal={modal}
        open={open}
        onOpenChange={handleOpenChange}
        snapPoints={[95]}
        snapPointsMode="percent"
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="medium"
    >
      
      <Sheet.Handle />
      
      <Sheet.Frame >
        <AllEntriesModal onClose={() => handleOpenChange(false)}/>
      </Sheet.Frame>
      
      <Sheet.Overlay 
        animation="lazy"
        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
        
    </Sheet>
  );
};

const SheetContents = () => {
    return (
        <View>
            <Text>Hello</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 16,
    height: '95%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  dragIndicator: {
    alignSelf: 'center',
    width: 60,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragIndicatorBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#DDDDDD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    height: 60,
    justifyContent: 'flex-end',
  },
  headerTitle: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 33,
    color: '#212121',
  },
  closeButton: {
    width: 48,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 16,
    height: 40,
  },
  categoryChip: {
    backgroundColor: '#F1F1F1',
    borderRadius: 16,
    width: 70,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  categoryChipActive: {
    backgroundColor: '#29B4D8',
  },
  categoryText: {
    color: '#555',
    fontSize: 12,
  },
  categoryTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  entriesContainer: {
    paddingBottom: 20,
  },
  entryCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 16,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  dateContainer: {
    width: 60,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: "#777",
    textTransform: 'uppercase',
  },
  dayText: {
    fontSize: 22,
    color: "#000",
  },
  entryContent: {
    flex: 1,
    paddingLeft: 15,
  },
  entryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#52AFA3",
  },
  entrySummary: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
  },
  entryCategoriesContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    marginLeft: 5,
    alignItems: 'flex-start',
  },
  entryCategoryDot: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    marginLeft: 5,
  },
});

export default EntriesSheet;
