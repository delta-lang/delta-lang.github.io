set -e

DELTA_VERSION=$(cat "$(dirname $0)/.delta-version")

if [ ! -d delta ]; then
    git clone --recursive https://github.com/delta-lang/delta.git
fi

cd delta
git checkout $DELTA_VERSION

# Parse LLVM version from Travis config.
LLVM_LONG_VERSION=$(grep -oP 'LLVM_VERSION=(\K.*)' .travis.yml)

curl -L "https://github.com/Kitware/CMake/releases/download/v3.15.0/cmake-3.15.0-Linux-x86_64.tar.gz" | tar xz
curl -L "http://releases.llvm.org/$LLVM_LONG_VERSION/clang+llvm-$LLVM_LONG_VERSION-x86_64-linux-gnu-ubuntu-18.04.tar.xz" | tar xJ

cmake-3.15.0-Linux-x86_64/bin/cmake . \
    -G 'Unix Makefiles' \
    -DCMAKE_BUILD_TYPE=Debug \
    -DCMAKE_PREFIX_PATH=$PWD/clang+llvm-$LLVM_LONG_VERSION-x86_64-linux-gnu-ubuntu-18.04
make -j

# Reduce size for Heroku slug compression.
rm -rf cmake-3.15.0-Linux-x86_64
mkdir -p ../lib/clang/$LLVM_LONG_VERSION
mv clang+llvm-$LLVM_LONG_VERSION-x86_64-linux-gnu-ubuntu-18.04/lib/clang/$LLVM_LONG_VERSION/include ../lib/clang/$LLVM_LONG_VERSION
rm -rf clang+llvm-$LLVM_LONG_VERSION-x86_64-linux-gnu-ubuntu-18.04
rm -f src/**/*.a
