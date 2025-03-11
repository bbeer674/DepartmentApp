import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import Loading from '../components/Loading';
import DepartmentService from '../services/DepartmentService';
import LoadingSmall from '../components/LoadingSmall';

interface DepartmentType {
  name: string;
  imageUrl: string;
  id: string;
}

interface ProductType {
  name: string;
  imageUrl: string;
  desc: string;
  price: string;
  type: string;
  id: string;
  departmentId: string;
}

interface DepartmentProps {
  departmentService: {
    DepartmentCarousel: () => Promise<{status: number; data: DepartmentType[]}>;
    ProductListing: (
      departmentId: string,
    ) => Promise<{status: number; data: ProductType[]}>;
  };
}

const {width} = Dimensions.get('window');

const Department: React.FC<DepartmentProps> = ({departmentService}) => {
  const flatListRef = useRef<FlatList>(null);
  const [data, setData] = useState<DepartmentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productDetail, setProductDetail] = useState<ProductType>();

  useEffect(() => {
    getDepartmentCarousel();
  }, []);
  const getDepartmentCarousel = async () => {
    setLoading(true);
    try {
      const response = await DepartmentService.DepartmentCarousel();
      if (response?.status === 200 && response.data.length > 0) {
        setData(response.data);
        setDepartmentName(response.data[0].name);
        fetchProducts(response.data[0].id);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (departmentId: string) => {
    setLoadingProduct(true);
    try {
      const response = await DepartmentService.ProductListing(departmentId);
      if (response?.status === 200) {
        setProducts(response.data);
        setLoadingProduct(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingProduct(false);
    }
  };

  const onClickDepartment = async (item: DepartmentType) => {
    setDepartmentName(item.name);
    fetchProducts(item.id);
  };

  const toggleModalVisibility = () => {
    setIsModalVisible(!isModalVisible);
  };

  const clickCard = (i: ProductType) => {
    setProductDetail(i);
    setIsModalVisible(true);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <View style={styles.container}>
          <Text style={styles.textHeader}>Department Carousel</Text>
          <View style={styles.departmentlist}>
            <FlatList
              ref={flatListRef}
              data={data}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => onClickDepartment(item)}>
                  <Text style={styles.textName}>{item.name}</Text>
                  <Image
                    source={{uri: item.imageUrl}}
                    style={styles.imgStyle}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToAlignment="center"
              decelerationRate="fast"
            />
          </View>

          <Text
            style={styles.textHeader}>{`Product list: ${departmentName}`}</Text>
          <View style={styles.productlist}></View>
          {loadingProduct ? (
            <LoadingSmall />
          ) : (
            <>
              {products.length > 0 && (
                <FlatList
                  data={products}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.cardProduct}
                      onPress={() => clickCard(item)}>
                      <Image
                        source={{uri: item.imageUrl}}
                        style={styles.image}
                        resizeMode="cover"
                      />
                      <View style={styles.boxProduct}>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={styles.name}>
                          {item.name}
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.desc}>
                          {item.desc}
                        </Text>
                      </View>
                      <Text style={styles.price}>{item.price}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.id}
                  numColumns={2}
                  columnWrapperStyle={styles.row}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingBottom: 300}}
                />
              )}
            </>
          )}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={toggleModalVisibility}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.productDescTital}>Product Description</Text>
                <Text style={styles.productDesc}>{productDetail?.desc}</Text>
                <View style={styles.line} />
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={toggleModalVisibility}>
                  <Text>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 60 : 30,
    paddingHorizontal: 10,
  },
  textHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  card: {
    marginHorizontal: 3,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginVertical: 10,
  },
  imgStyle: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  textName: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    position: 'absolute',
    zIndex: 1,
    right: 5,
    top: 5,
    padding: 5,
    backgroundColor: '#FFF',
  },
  departmentlist: {
    marginVertical: 10,
  },
  productlist: {
    marginTop: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardProduct: {
    backgroundColor: '#fff',
    width: width / 2 - 20,
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginHorizontal: 3,
    height: 230,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  boxProduct: {
    flex: 1,
    padding: 5,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 5,
    maxWidth: '100%',
  },
  price: {
    fontSize: 16,
    color: '#FF5733',
    fontWeight: 'bold',
    textAlign: 'right',
    padding: 5,
    paddingBottom: 10,
  },
  desc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  productDescTital: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 5,
    paddingVertical: 10,
  },
  productDesc: {
    fontSize: 14,
    textAlign: 'left',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
  },
  buttonClose: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
});

export default Department;
