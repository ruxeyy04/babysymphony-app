import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/Button';
const App = () => {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['20%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index);
  }, []);
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
    []
  );

  return (
    <View className='flex-1 justify-center items-center bg-primary'>
 
      <CustomButton
            title="Profile Menu"
            handlePress={handlePresentModalPress}
            containerStyles="w-1/2 mt-7"
          />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.bottomSheetView}>
          <MenuItem icon={<Ionicons name='settings-outline' size={24}></Ionicons>} label="Profile Setting" />
          <MenuItem icon={<Ionicons name="exit-outline" size={24} color={"#fc0313"}></Ionicons>} label="Logout" />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};
type MenuProps = {
  icon: any,
  label: string
}

const MenuItem = ({ icon, label }: MenuProps) => (
  <TouchableOpacity className='flex flex-row items-center p-2.5 my-1.5 rounded bg-white' style={styles.menuItem}>
    {icon}
    <Text className='ml-[10px] text-[16px] font-pmedium text-[#333]'>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({

  bottomSheetView: {
    padding: 20,
  },
  menuItem: {

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },

});

export default App;
