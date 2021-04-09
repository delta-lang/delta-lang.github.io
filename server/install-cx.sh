set -e

CX_VERSION=$(cat "$(dirname $0)/.cx-version")

if [ ! -d cx ]; then
    git clone --recursive https://github.com/cx-language/cx.git
fi

cd cx
git checkout $CX_VERSION

LLVM_VERSION=$(grep -oP 'LLVM_VERSION: (\K.*)' .github/workflows/build.yml)
LLVM_TARBALL=clang+llvm-$LLVM_VERSION-x86_64-linux-gnu-ubuntu-20.04

curl -L "https://github.com/Kitware/CMake/releases/download/v3.15.0/cmake-3.15.0-Linux-x86_64.tar.gz" | tar xz
curl -L "https://github.com/llvm/llvm-project/releases/download/llvmorg-$LLVM_VERSION/$LLVM_TARBALL.tar.xz" | tar xJ

cmake-3.15.0-Linux-x86_64/bin/cmake . \
    -G 'Unix Makefiles' \
    -DCMAKE_BUILD_TYPE=Debug \
    -DCMAKE_PREFIX_PATH=$PWD/$LLVM_TARBALL
make -j

# Reduce size for Heroku slug compression.
rm -rf cmake-3.15.0-Linux-x86_64
mkdir -p ../lib/clang/$LLVM_VERSION
mv $LLVM_TARBALL/lib/clang/$LLVM_VERSION/include ../lib/clang/$LLVM_VERSION
rm -rf $LLVM_TARBALL
rm -f src/**/*.a
